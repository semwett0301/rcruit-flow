/**
 * CV Upload Service
 * 
 * Handles CV file uploads with proper validation, error handling,
 * and categorization of different error types.
 */
import { Injectable, Logger } from '@nestjs/common';
import { CvUploadErrorCode } from '@rcruit-flow/dto';
import { CvUploadException } from '../common/exceptions/cv-upload.exception';
import { CvFileValidator } from '../common/validators/cv-file.validator';

/**
 * Result interface for successful CV uploads
 */
export interface CvUploadResult {
  /** Unique identifier for the uploaded CV */
  id: string;
  /** Original filename of the uploaded CV */
  filename: string;
}

/**
 * Service responsible for handling CV file uploads.
 * Provides validation, error categorization, and file storage functionality.
 */
@Injectable()
export class CvUploadService {
  private readonly logger = new Logger(CvUploadService.name);

  /**
   * Uploads a CV file for a specific user.
   * 
   * @param file - The uploaded file from Multer
   * @param userId - The ID of the user uploading the CV
   * @returns Promise containing the file ID and filename
   * @throws CvUploadException with appropriate error code on failure
   */
  async uploadCv(file: Express.Multer.File, userId: string): Promise<CvUploadResult> {
    this.logger.log(`Starting CV upload for user ${userId}`);

    try {
      // Validate file metadata (size, type, etc.)
      CvFileValidator.validate(file);

      // Validate file integrity (content matches declared type)
      CvFileValidator.validateFileIntegrity(file.buffer, file.mimetype);

      // Process and store the file
      const result = await this.processAndStoreFile(file, userId);
      
      this.logger.log(`CV upload successful for user ${userId}, file ID: ${result.id}`);
      return result;
    } catch (error) {
      this.handleUploadError(error, userId);
    }
  }

  /**
   * Processes and stores the uploaded CV file.
   * 
   * @param file - The validated file to store
   * @param userId - The ID of the user
   * @returns Promise containing the stored file details
   * @throws CvUploadException with PROCESSING_ERROR on failure
   */
  private async processAndStoreFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<CvUploadResult> {
    try {
      // TODO: Implement actual file storage logic
      // This could include:
      // - Uploading to cloud storage (S3, GCS, etc.)
      // - Saving to local filesystem
      // - Storing metadata in database
      const fileId = this.generateFileId(userId);
      
      return {
        id: fileId,
        filename: file.originalname,
      };
    } catch (error) {
      this.logger.error(`File processing failed for user ${userId}`, error);
      throw new CvUploadException(CvUploadErrorCode.PROCESSING_ERROR);
    }
  }

  /**
   * Generates a unique file ID for the uploaded CV.
   * 
   * @param userId - The ID of the user
   * @returns A unique file identifier
   */
  private generateFileId(userId: string): string {
    return `cv_${userId}_${Date.now()}`;
  }

  /**
   * Handles and categorizes upload errors, throwing appropriate CvUploadException.
   * 
   * @param error - The caught error
   * @param userId - The ID of the user for logging purposes
   * @throws CvUploadException with categorized error code
   */
  private handleUploadError(error: unknown, userId: string): never {
    this.logger.error(`CV upload failed for user ${userId}`, error);

    // Re-throw if already a CvUploadException
    if (error instanceof CvUploadException) {
      throw error;
    }

    // Type guard for error with code property
    const errorWithCode = error as { code?: string; message?: string };

    // Categorize network-related errors
    if (this.isNetworkTimeoutError(errorWithCode.code)) {
      throw new CvUploadException(CvUploadErrorCode.NETWORK_TIMEOUT);
    }

    // Categorize partial upload errors
    if (this.isPartialUploadError(errorWithCode)) {
      throw new CvUploadException(CvUploadErrorCode.PARTIAL_UPLOAD);
    }

    // Default to server error for unhandled cases
    throw new CvUploadException(CvUploadErrorCode.SERVER_ERROR);
  }

  /**
   * Checks if the error code indicates a network timeout.
   * 
   * @param code - The error code to check
   * @returns True if the error is a network timeout
   */
  private isNetworkTimeoutError(code?: string): boolean {
    const networkTimeoutCodes = ['ETIMEDOUT', 'ECONNRESET'];
    return code !== undefined && networkTimeoutCodes.includes(code);
  }

  /**
   * Checks if the error indicates a partial upload failure.
   * 
   * @param error - The error object to check
   * @returns True if the error indicates a partial upload
   */
  private isPartialUploadError(error: { code?: string; message?: string }): boolean {
    if (error.code === 'ECONNABORTED') {
      return true;
    }
    
    if (error.message?.toLowerCase().includes('partial')) {
      return true;
    }
    
    return false;
  }
}
