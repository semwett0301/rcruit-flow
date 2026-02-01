/**
 * Custom exceptions for CV upload failures.
 * Provides structured error responses with specific error codes and details
 * for different CV upload failure scenarios.
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  CvUploadErrorCode,
  CvUploadErrorResponse,
  CV_UPLOAD_CONSTRAINTS,
} from '@rcruit-flow/dto';

/**
 * Custom exception class for CV upload related errors.
 * Extends NestJS HttpException to provide structured error responses
 * with specific error codes and contextual details.
 */
export class CvUploadException extends HttpException {
  constructor(errorResponse: CvUploadErrorResponse, status: HttpStatus) {
    super(errorResponse, status);
  }

  /**
   * Creates an exception for invalid file type uploads.
   * Returns HTTP 415 Unsupported Media Type.
   */
  static invalidFileType(): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.INVALID_FILE_TYPE,
        message: 'Invalid file type',
        details: {
          allowedTypes: CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
        },
      },
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    );
  }

  /**
   * Creates an exception for files exceeding the maximum allowed size.
   * Returns HTTP 413 Payload Too Large.
   */
  static fileSizeExceeded(): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
        message: 'File size exceeded',
        details: {
          maxSize: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB,
        },
      },
      HttpStatus.PAYLOAD_TOO_LARGE,
    );
  }

  /**
   * Creates an exception for corrupted or unprocessable files.
   * Returns HTTP 422 Unprocessable Entity.
   */
  static fileCorrupted(): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.FILE_CORRUPTED,
        message: 'File is corrupted or cannot be processed',
        details: {
          retryable: false,
        },
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  /**
   * Creates an exception for internal server errors during file processing.
   * Returns HTTP 500 Internal Server Error.
   */
  static serverError(): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.SERVER_ERROR,
        message: 'Internal server error during file processing',
        details: {
          retryable: true,
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
