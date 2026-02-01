/**
 * CV File Validator
 *
 * Utility class for validating CV file uploads with specific error detection.
 * Validates file presence, size, MIME type, extension, and file integrity.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';
import { CvUploadException } from '../exceptions/cv-upload.exception';

export class CvFileValidator {
  /**
   * Validates a CV file upload against all constraints.
   *
   * @param file - The uploaded file from Multer
   * @throws CvUploadException if validation fails
   */
  static validate(file: Express.Multer.File): void {
    if (!file) {
      throw new CvUploadException(CvUploadErrorCode.EMPTY_FILE);
    }

    if (file.size === 0) {
      throw new CvUploadException(CvUploadErrorCode.EMPTY_FILE, { receivedSize: 0 });
    }

    if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      throw new CvUploadException(CvUploadErrorCode.FILE_TOO_LARGE, { receivedSize: file.size });
    }

    if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new CvUploadException(CvUploadErrorCode.INVALID_FILE_TYPE, { receivedType: file.mimetype });
    }

    const extension = this.getFileExtension(file.originalname);
    if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension.toLowerCase())) {
      throw new CvUploadException(CvUploadErrorCode.UNSUPPORTED_FORMAT, { receivedType: extension });
    }
  }

  /**
   * Validates file integrity by checking magic bytes.
   * Ensures the file content matches its declared MIME type.
   *
   * @param buffer - The file buffer to validate
   * @param mimetype - The declared MIME type of the file
   * @throws CvUploadException if file appears corrupted
   */
  static validateFileIntegrity(buffer: Buffer, mimetype: string): void {
    try {
      // Check PDF magic bytes
      if (mimetype === 'application/pdf') {
        const pdfHeader = buffer.slice(0, 5).toString();
        if (!pdfHeader.startsWith('%PDF-')) {
          throw new CvUploadException(CvUploadErrorCode.FILE_CORRUPTED);
        }
      }

      // Check DOC/DOCX magic bytes
      if (mimetype.includes('msword') || mimetype.includes('wordprocessingml')) {
        const docHeader = buffer.slice(0, 4);
        const pkSignature = Buffer.from([0x50, 0x4b, 0x03, 0x04]); // DOCX (ZIP)
        const oleSignature = Buffer.from([0xd0, 0xcf, 0x11, 0xe0]); // DOC (OLE)

        if (!docHeader.equals(pkSignature.slice(0, 4)) && !docHeader.equals(oleSignature.slice(0, 4))) {
          throw new CvUploadException(CvUploadErrorCode.FILE_CORRUPTED);
        }
      }
    } catch (error) {
      if (error instanceof CvUploadException) throw error;
      throw new CvUploadException(CvUploadErrorCode.FILE_CORRUPTED);
    }
  }

  /**
   * Extracts the file extension from a filename.
   *
   * @param filename - The original filename
   * @returns The file extension including the dot (e.g., '.pdf'), or empty string if none
   */
  private static getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.slice(lastDot) : '';
  }
}
