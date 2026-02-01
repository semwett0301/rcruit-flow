/**
 * CV File Validation Pipe
 *
 * A NestJS pipe that validates uploaded CV files against defined constraints.
 * Validates file presence, MIME type, file extension, and file size.
 */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';
import { CvUploadException } from '../exceptions/cv-upload.exception';

@Injectable()
export class CvFileValidationPipe implements PipeTransform {
  /**
   * Transforms and validates the uploaded CV file.
   *
   * @param file - The uploaded file from Multer
   * @param metadata - Argument metadata from NestJS
   * @returns The validated file if all checks pass
   * @throws CvUploadException if validation fails
   */
  transform(file: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File {
    // Check if file exists
    if (!file) {
      throw CvUploadException.invalidFileType('none');
    }

    // Validate file MIME type
    const allowedMimeTypes = CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES;
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw CvUploadException.invalidFileType(file.mimetype);
    }

    // Validate file extension
    const fileNameParts = file.originalname.split('.');
    const extension = fileNameParts.length > 1
      ? '.' + fileNameParts.pop()?.toLowerCase()
      : '';

    if (!extension || !CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
      throw CvUploadException.invalidFileType(extension || 'unknown');
    }

    // Validate file size
    if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      const fileSizeMB = Math.round((file.size / (1024 * 1024)) * 100) / 100;
      throw CvUploadException.fileSizeExceeded(
        fileSizeMB,
        CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB
      );
    }

    return file;
  }
}
