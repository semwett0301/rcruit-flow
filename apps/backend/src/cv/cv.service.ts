/**
 * CV Service
 *
 * Handles CV file upload processing, validation, and storage.
 * Provides secure file handling with content validation and error handling.
 */
import { Injectable, Logger } from '@nestjs/common';
import { CvUploadException } from './exceptions/cv-upload.exception';

@Injectable()
export class CvService {
  private readonly logger = new Logger(CvService.name);

  /**
   * Process an uploaded CV file
   *
   * @param file - The uploaded file from Multer
   * @returns Object containing the generated file ID and original filename
   * @throws CvUploadException if file validation fails or processing errors occur
   */
  async processUpload(
    file: Express.Multer.File,
  ): Promise<{ id: string; filename: string }> {
    try {
      // Validate file content (basic PDF/DOC header check)
      const isValidContent = this.validateFileContent(file);
      if (!isValidContent) {
        throw CvUploadException.fileCorrupted();
      }

      // Process and store the file (implementation depends on storage strategy)
      const fileId = this.generateFileId();

      // TODO: Implement actual file storage logic
      this.logger.log(`CV uploaded successfully: ${fileId}`);

      return {
        id: fileId,
        filename: file.originalname,
      };
    } catch (error) {
      if (error instanceof CvUploadException) {
        throw error;
      }
      this.logger.error('CV upload processing failed', error);
      throw CvUploadException.serverError();
    }
  }

  /**
   * Upload CV file (alias for processUpload for backward compatibility)
   *
   * @param file - The uploaded file from Multer
   * @returns Object containing the generated file ID and original filename
   * @throws CvUploadException if file validation fails or processing errors occur
   */
  async uploadCv(
    file: Express.Multer.File,
  ): Promise<{ id: string; filename: string }> {
    return this.processUpload(file);
  }

  /**
   * Validate file content by checking magic bytes
   *
   * Performs header validation for PDF and DOC/DOCX files to ensure
   * the file content matches the declared MIME type.
   *
   * @param file - The uploaded file to validate
   * @returns true if file content is valid, false otherwise
   */
  private validateFileContent(file: Express.Multer.File): boolean {
    const buffer = file.buffer;

    if (!buffer || buffer.length < 8) {
      return false;
    }

    // Check PDF magic bytes
    if (file.mimetype === 'application/pdf') {
      return buffer.slice(0, 4).toString() === '%PDF';
    }

    // Check DOC/DOCX magic bytes (ZIP format for DOCX)
    if (file.mimetype.includes('word') || file.mimetype.includes('document')) {
      // DOCX files are ZIP archives
      const zipMagic = buffer.slice(0, 4);
      const isZip = zipMagic[0] === 0x50 && zipMagic[1] === 0x4b;
      // DOC files have different magic bytes (OLE Compound Document)
      const docMagic = buffer.slice(0, 8);
      const isDoc = docMagic[0] === 0xd0 && docMagic[1] === 0xcf;
      return isZip || isDoc;
    }

    return false;
  }

  /**
   * Generate a unique file ID for storage
   *
   * Creates a unique identifier combining timestamp and random string
   * to ensure uniqueness across uploads.
   *
   * @returns Unique file identifier string
   */
  private generateFileId(): string {
    return `cv_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
