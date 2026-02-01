/**
 * CV File Validator
 *
 * Utility class for validating CV file uploads.
 * Provides static methods for validating file type, size, and integrity.
 */
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';
import { CvUploadException } from '../exceptions/cv-upload.exception';

/**
 * Static utility class for CV file validation.
 *
 * Provides validation methods for:
 * - File MIME type validation
 * - File size validation
 * - File integrity validation (magic bytes check)
 *
 * @example
 * ```typescript
 * // Validate individual aspects
 * CvFileValidator.validateFileType(file.mimetype);
 * CvFileValidator.validateFileSize(file.size);
 * CvFileValidator.validateFileIntegrity(file.buffer, file.mimetype);
 *
 * // Or validate all at once
 * CvFileValidator.validate(file);
 * ```
 */
export class CvFileValidator {
  /**
   * Validates that the file MIME type is allowed for CV uploads.
   *
   * @param mimeType - The MIME type of the uploaded file
   * @throws CvUploadException if the MIME type is not in the allowed list
   */
  static validateFileType(mimeType: string): void {
    if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(mimeType)) {
      throw CvUploadException.invalidFileType(
        mimeType,
        CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
      );
    }
  }

  /**
   * Validates that the file size does not exceed the maximum allowed size.
   *
   * @param size - The size of the file in bytes
   * @throws CvUploadException if the file size exceeds the maximum
   */
  static validateFileSize(size: number): void {
    if (size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      const fileSizeMb = Math.round((size / (1024 * 1024)) * 100) / 100;
      throw CvUploadException.fileSizeExceeded(
        fileSizeMb,
        CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB,
      );
    }
  }

  /**
   * Validates file integrity by checking magic bytes.
   *
   * Performs format-specific validation:
   * - PDF files: Checks for '%PDF' header
   * - DOCX files: Checks for ZIP signature (0x50 0x4B)
   *
   * @param buffer - The file buffer to validate
   * @param mimeType - The MIME type of the file
   * @throws CvUploadException if the file appears to be corrupted
   */
  static validateFileIntegrity(buffer: Buffer, mimeType: string): void {
    // Basic check - ensure buffer has content
    if (!buffer || buffer.length === 0) {
      throw CvUploadException.fileCorrupted();
    }

    // Check magic bytes for PDF
    if (mimeType === 'application/pdf') {
      const pdfHeader = buffer.slice(0, 4).toString();
      if (pdfHeader !== '%PDF') {
        throw CvUploadException.fileCorrupted();
      }
    }

    // Check magic bytes for DOCX (ZIP-based format)
    if (
      mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const zipHeader = buffer.slice(0, 4);
      // ZIP files start with PK (0x50 0x4B)
      if (zipHeader[0] !== 0x50 || zipHeader[1] !== 0x4b) {
        throw CvUploadException.fileCorrupted();
      }
    }
  }

  /**
   * Performs complete validation of a CV file upload.
   *
   * Validates file type, size, and integrity in sequence.
   *
   * @param file - The Multer file object to validate
   * @throws CvUploadException if any validation fails
   */
  static validate(file: Express.Multer.File): void {
    this.validateFileType(file.mimetype);
    this.validateFileSize(file.size);
    this.validateFileIntegrity(file.buffer, file.mimetype);
  }
}
