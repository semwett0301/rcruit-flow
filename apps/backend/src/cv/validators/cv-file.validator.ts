/**
 * CV File Validation Pipe
 *
 * NestJS pipe for validating CV file uploads.
 * Validates file type, size, and basic integrity before processing.
 */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';
import { CvUploadException } from '../exceptions/cv-upload.exception';

/**
 * Validation pipe for CV file uploads.
 *
 * Performs the following validations:
 * - File presence check
 * - MIME type validation against allowed types
 * - File size validation against maximum allowed size
 * - Basic corruption check (buffer content verification)
 *
 * @example
 * ```typescript
 * @Post('upload')
 * @UseInterceptors(FileInterceptor('file'))
 * async uploadCv(
 *   @UploadedFile(CvFileValidationPipe) file: Express.Multer.File
 * ) {
 *   // file is guaranteed to be valid here
 * }
 * ```
 */
@Injectable()
export class CvFileValidationPipe implements PipeTransform {
  /**
   * Transforms and validates the uploaded CV file.
   *
   * @param file - The uploaded file from Multer
   * @param metadata - NestJS argument metadata (unused but required by interface)
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

    // Validate file MIME type against allowed types
    if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.mimetype)) {
      throw CvUploadException.invalidFileType(
        file.mimetype,
        CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
      );
    }

    // Validate file size against maximum allowed size
    if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      const fileSizeMb = Math.round((file.size / (1024 * 1024)) * 100) / 100;
      throw CvUploadException.fileSizeExceeded(
        fileSizeMb,
        CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB,
      );
    }

    // Basic corruption check - verify file has content
    if (!file.buffer || file.buffer.length === 0) {
      throw CvUploadException.fileCorrupted();
    }

    return file;
  }
}
