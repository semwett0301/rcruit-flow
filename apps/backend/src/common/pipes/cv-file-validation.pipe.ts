/**
 * CV File Validation Pipe
 *
 * A NestJS pipe that validates uploaded CV files against defined constraints.
 * Validates file presence, MIME type, file extension, file size, and file integrity.
 */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';
import {
  InvalidFileTypeException,
  FileSizeExceededException,
  FileCorruptedException,
} from '../exceptions/cv-upload.exception';

@Injectable()
export class CvFileValidationPipe implements PipeTransform {
  /**
   * Transforms and validates the uploaded CV file.
   *
   * @param file - The uploaded file from Multer
   * @param metadata - Argument metadata from NestJS
   * @returns The validated file if all checks pass
   * @throws InvalidFileTypeException if file is missing or has invalid type/extension
   * @throws FileSizeExceededException if file exceeds maximum allowed size
   * @throws FileCorruptedException if file is empty or corrupted
   */
  transform(file: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File {
    // Check if file exists
    if (!file) {
      throw new InvalidFileTypeException();
    }

    // Validate file type (MIME type or extension)
    const fileExtension = '.' + file.originalname.split('.').pop()?.toLowerCase();
    const isValidType =
      CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.mimetype) ||
      CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(fileExtension);

    if (!isValidType) {
      throw new InvalidFileTypeException();
    }

    // Validate file size
    if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      throw new FileSizeExceededException(CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB);
    }

    // Check for empty/corrupted file
    if (file.size === 0 || !file.buffer || file.buffer.length === 0) {
      throw new FileCorruptedException();
    }

    return file;
  }
}
