/**
 * CV File Validation Pipe
 *
 * A NestJS pipe that validates uploaded CV files against defined constraints.
 * Validates file presence, MIME type, file extension, file size, and file integrity.
 */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CV_UPLOAD_CONSTRAINTS } from '@recruit-flow/dto';
import {
  InvalidFileTypeException,
  FileSizeExceededException,
  CorruptedFileException,
} from '../exceptions/cv-upload.exception';

@Injectable()
export class CvFileValidationPipe implements PipeTransform {
  /**
   * Transforms and validates the uploaded CV file.
   *
   * @param file - The uploaded file from Multer
   * @param metadata - Argument metadata from NestJS
   * @returns The validated file if all checks pass
   * @throws CorruptedFileException if file is missing or empty
   * @throws InvalidFileTypeException if file has invalid MIME type and extension
   * @throws FileSizeExceededException if file exceeds maximum allowed size
   */
  transform(file: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File {
    // Check if file exists
    if (!file) {
      throw new CorruptedFileException();
    }

    // Validate file type (MIME type and extension)
    const isValidMimeType = CV_UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.mimetype);
    const fileExtension = '.' + file.originalname.split('.').pop()?.toLowerCase();
    const isValidExtension = CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(fileExtension);

    if (!isValidMimeType && !isValidExtension) {
      throw new InvalidFileTypeException(file.mimetype || fileExtension);
    }

    // Validate file size
    if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      throw new FileSizeExceededException(file.size, CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES);
    }

    // Check for empty file (corrupted)
    if (file.size === 0) {
      throw new CorruptedFileException();
    }

    return file;
  }
}
