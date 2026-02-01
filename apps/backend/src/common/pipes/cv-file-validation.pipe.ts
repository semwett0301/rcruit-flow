/**
 * CV File Validation Pipe
 *
 * A NestJS pipe that validates uploaded CV files for:
 * - File presence
 * - Allowed MIME types (PDF, DOC, DOCX)
 * - Maximum file size
 * - File integrity (non-empty buffer)
 */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';
import { CvUploadException } from '../exceptions/cv-upload.exception';

@Injectable()
export class CvFileValidationPipe implements PipeTransform {
  /**
   * Validates the uploaded CV file against defined constraints.
   *
   * @param file - The uploaded file from Multer
   * @param metadata - NestJS argument metadata
   * @returns The validated file if all checks pass
   * @throws CvUploadException if validation fails
   */
  transform(
    file: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    // Check if file exists
    if (!file) {
      throw CvUploadException.invalidFileType(
        'none',
        CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
      );
    }

    // Validate file type against allowed MIME types
    if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.mimetype)) {
      throw CvUploadException.invalidFileType(
        file.mimetype,
        CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
      );
    }

    // Validate file size against maximum allowed size
    if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      throw CvUploadException.fileSizeExceeded(
        Math.round((file.size / (1024 * 1024)) * 100) / 100,
        CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB,
      );
    }

    // Basic corruption check - ensure buffer exists and has content
    if (!file.buffer || file.buffer.length === 0) {
      throw CvUploadException.fileCorrupted();
    }

    return file;
  }
}
