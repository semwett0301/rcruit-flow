/**
 * CV File Validation Pipe
 *
 * A NestJS pipe that validates uploaded CV files against defined constraints.
 * Validates file type (MIME type), file extension, and file size.
 */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';
import {
  InvalidFileTypeException,
  FileSizeExceededException,
} from '../exceptions/cv-upload.exception';

/**
 * Validation pipe for CV file uploads.
 *
 * Performs the following validations:
 * - Ensures a file is provided
 * - Validates MIME type against allowed types
 * - Validates file extension against allowed extensions
 * - Validates file size against maximum allowed size
 *
 * @throws {InvalidFileTypeException} When no file is provided, MIME type is invalid, or extension is invalid
 * @throws {FileSizeExceededException} When file size exceeds the maximum allowed size
 */
@Injectable()
export class CvFileValidationPipe implements PipeTransform {
  /**
   * Transforms and validates the uploaded CV file.
   *
   * @param file - The uploaded file from Multer
   * @param metadata - Argument metadata from NestJS
   * @returns The validated file if all validations pass
   */
  transform(
    file: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    // Ensure a file was provided
    if (!file) {
      throw new InvalidFileTypeException('No file provided');
    }

    // Validate file MIME type
    if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new InvalidFileTypeException(file.mimetype);
    }

    // Validate file extension
    const fileNameParts = file.originalname.split('.');
    const extension =
      fileNameParts.length > 1
        ? '.' + fileNameParts.pop()?.toLowerCase()
        : '';

    if (!extension || !CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
      throw new InvalidFileTypeException(extension || 'unknown');
    }

    // Validate file size
    if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      throw new FileSizeExceededException(
        file.size,
        CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
      );
    }

    return file;
  }
}
