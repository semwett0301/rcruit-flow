/**
 * Custom exceptions for CV upload errors.
 * Provides structured error responses for various CV upload failure scenarios.
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

/**
 * Base exception class for CV upload related errors.
 * Extends NestJS HttpException to provide structured error responses
 * with specific error codes and messages.
 */
export class CvUploadException extends HttpException {
  constructor(code: CvUploadErrorCode, message: string, status: HttpStatus) {
    super({ code, message }, status);
  }
}

/**
 * Exception thrown when an uploaded file has an invalid type.
 * Accepted formats are: PDF, DOC, DOCX
 */
export class InvalidFileTypeException extends CvUploadException {
  constructor() {
    super(
      CvUploadErrorCode.INVALID_FILE_TYPE,
      'Invalid file type. Accepted formats: PDF, DOC, DOCX',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown when an uploaded file exceeds the maximum allowed size.
 */
export class FileSizeExceededException extends CvUploadException {
  constructor(maxSizeMB: number) {
    super(
      CvUploadErrorCode.FILE_SIZE_EXCEEDED,
      `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
      HttpStatus.PAYLOAD_TOO_LARGE,
    );
  }
}

/**
 * Exception thrown when an uploaded file appears to be corrupted or unreadable.
 */
export class FileCorruptedException extends CvUploadException {
  constructor() {
    super(
      CvUploadErrorCode.FILE_CORRUPTED,
      'File appears to be corrupted or unreadable',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

/**
 * Exception thrown when an error occurs during CV processing.
 */
export class CvProcessingException extends CvUploadException {
  constructor() {
    super(
      CvUploadErrorCode.SERVER_ERROR,
      'An error occurred while processing the CV',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
