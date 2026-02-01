/**
 * Custom exceptions for CV upload errors.
 * Provides structured error responses for various CV upload failure scenarios.
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { CvUploadErrorCode, CvUploadErrorResponse } from '@rcruit-flow/dto';

/**
 * Base exception class for CV upload related errors.
 * Extends NestJS HttpException to provide structured error responses
 * with specific error codes, messages, and optional details.
 */
export class CvUploadException extends HttpException {
  constructor(code: CvUploadErrorCode, message: string, details?: Record<string, unknown>) {
    const response: CvUploadErrorResponse = { code, message, details };
    const status = CvUploadException.getHttpStatus(code);
    super(response, status);
  }

  /**
   * Maps error codes to appropriate HTTP status codes.
   */
  private static getHttpStatus(code: CvUploadErrorCode): HttpStatus {
    switch (code) {
      case CvUploadErrorCode.INVALID_FILE_TYPE:
        return HttpStatus.UNSUPPORTED_MEDIA_TYPE;
      case CvUploadErrorCode.FILE_SIZE_EXCEEDED:
        return HttpStatus.PAYLOAD_TOO_LARGE;
      case CvUploadErrorCode.CORRUPTED_FILE:
      case CvUploadErrorCode.PARSING_ERROR:
        return HttpStatus.UNPROCESSABLE_ENTITY;
      case CvUploadErrorCode.SERVER_ERROR:
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}

/**
 * Exception thrown when an uploaded file has an invalid type.
 * Accepted formats are: PDF, DOC, DOCX
 */
export class InvalidFileTypeException extends CvUploadException {
  constructor(receivedType: string) {
    super(
      CvUploadErrorCode.INVALID_FILE_TYPE,
      'Invalid file type provided',
      { receivedType }
    );
  }
}

/**
 * Exception thrown when an uploaded file exceeds the maximum allowed size.
 */
export class FileSizeExceededException extends CvUploadException {
  constructor(fileSize: number, maxSize: number) {
    super(
      CvUploadErrorCode.FILE_SIZE_EXCEEDED,
      'File size exceeds maximum allowed',
      { fileSize, maxSize }
    );
  }
}

/**
 * Exception thrown when an uploaded file appears to be corrupted or unreadable.
 */
export class CorruptedFileException extends CvUploadException {
  constructor() {
    super(
      CvUploadErrorCode.CORRUPTED_FILE,
      'File appears to be corrupted or unreadable'
    );
  }
}

/**
 * Exception thrown when CV content parsing fails.
 */
export class CvParsingException extends CvUploadException {
  constructor(reason?: string) {
    super(
      CvUploadErrorCode.PARSING_ERROR,
      'Failed to parse CV content',
      reason ? { reason } : undefined
    );
  }
}
