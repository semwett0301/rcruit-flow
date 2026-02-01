/**
 * CV File Validator Service
 *
 * Provides comprehensive validation for CV file uploads including:
 * - File type validation (MIME type checking)
 * - File size validation
 * - File integrity validation (magic number verification)
 */
import { Injectable } from '@nestjs/common';
import { CV_UPLOAD_CONSTRAINTS } from '@repo/dto';
import {
  InvalidFileTypeException,
  FileSizeExceededException,
  FileCorruptedException,
} from '../exceptions/cv-upload.exception';

@Injectable()
export class CvFileValidator {
  /**
   * Validates an uploaded CV file against all constraints.
   * Throws appropriate exceptions if validation fails.
   *
   * @param file - The uploaded file from Multer
   * @throws InvalidFileTypeException - If file MIME type is not allowed
   * @throws FileSizeExceededException - If file exceeds maximum size
   * @throws FileCorruptedException - If file is empty or has invalid structure
   */
  validateFile(file: Express.Multer.File): void {
    this.validateFileType(file);
    this.validateFileSize(file);
    this.validateFileIntegrity(file);
  }

  /**
   * Validates that the file MIME type is in the allowed list.
   *
   * @param file - The uploaded file
   * @throws InvalidFileTypeException - If MIME type is not allowed
   */
  private validateFileType(file: Express.Multer.File): void {
    if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new InvalidFileTypeException(file.mimetype);
    }
  }

  /**
   * Validates that the file size does not exceed the maximum allowed size.
   *
   * @param file - The uploaded file
   * @throws FileSizeExceededException - If file size exceeds limit
   */
  private validateFileSize(file: Express.Multer.File): void {
    if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      throw new FileSizeExceededException(file.size);
    }
  }

  /**
   * Validates file integrity by checking for empty files and verifying
   * magic numbers (file signatures) for supported document formats.
   *
   * Supported formats:
   * - PDF: Starts with '%PDF'
   * - DOC (legacy): Starts with 0xD0CF (OLE compound document)
   * - DOCX: Starts with 0x504B (ZIP archive, as DOCX is ZIP-based)
   *
   * @param file - The uploaded file
   * @throws FileCorruptedException - If file is empty or has invalid magic number
   */
  private validateFileIntegrity(file: Express.Multer.File): void {
    // Check for empty files or files with no buffer
    if (!file.buffer || file.buffer.length === 0) {
      throw new FileCorruptedException();
    }

    // Basic magic number validation for PDF and DOC files
    const header = file.buffer.slice(0, 8);

    // PDF magic number: %PDF
    const isPdf = header.slice(0, 4).toString() === '%PDF';

    // DOC (OLE Compound Document) magic number: D0 CF 11 E0
    const isDoc = header[0] === 0xd0 && header[1] === 0xcf;

    // DOCX (ZIP-based) magic number: 50 4B (PK)
    const isDocx = header[0] === 0x50 && header[1] === 0x4b;

    if (!isPdf && !isDoc && !isDocx) {
      throw new FileCorruptedException();
    }
  }
}
