/**
 * CV File Validation Utilities
 *
 * Provides validation functions for CV/resume file uploads including:
 * - MIME type validation
 * - File extension validation
 * - File size validation
 * - File content/magic bytes validation
 */

import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';
import { CvUploadException } from '../exceptions/cv-upload.exception';

/**
 * Validates a CV file upload against defined constraints.
 *
 * @param file - The uploaded file from Multer
 * @throws CvUploadException if validation fails
 */
export function validateCvFile(file: Express.Multer.File): void {
  if (!file) {
    throw CvUploadException.invalidFileType();
  }

  // Validate MIME type
  if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.mimetype)) {
    throw CvUploadException.invalidFileType();
  }

  // Validate file extension
  const extension = '.' + file.originalname.split('.').pop()?.toLowerCase();
  if (!extension || !CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
    throw CvUploadException.invalidFileType();
  }

  // Validate file size
  if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
    throw CvUploadException.fileSizeExceeded();
  }
}

/**
 * Validates the actual content of a CV file by checking magic bytes.
 * This provides an additional layer of security beyond MIME type checking.
 *
 * Supported formats:
 * - PDF: Magic bytes '%PDF' at start
 * - DOCX: ZIP format magic bytes (504b0304)
 * - DOC: OLE compound document magic bytes (d0cf11e0a1b11ae1)
 *
 * @param buffer - The file content as a Buffer
 * @throws CvUploadException if the file content doesn't match expected formats
 */
export async function validateCvFileContent(buffer: Buffer): Promise<void> {
  if (!buffer || buffer.length < 8) {
    throw CvUploadException.fileCorrupted();
  }

  // Check for PDF magic bytes
  const isPdf = buffer.slice(0, 4).toString() === '%PDF';

  // Check for DOC/DOCX magic bytes (ZIP format for DOCX, OLE for DOC)
  const isDocx = buffer.slice(0, 4).toString('hex') === '504b0304';
  const isDoc = buffer.slice(0, 8).toString('hex') === 'd0cf11e0a1b11ae1';

  if (!isPdf && !isDocx && !isDoc) {
    throw CvUploadException.fileCorrupted();
  }
}
