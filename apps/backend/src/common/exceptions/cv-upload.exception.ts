/**
 * Custom exceptions for CV upload errors.
 * 
 * These exceptions provide structured error responses for various CV upload
 * failure scenarios, mapping each error type to appropriate HTTP status codes.
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { CvUploadErrorCode, CvUploadErrorResponse } from '@rcruit-flow/dto';

/**
 * Base exception class for CV upload errors.
 * Maps error codes to appropriate HTTP status codes and provides
 * structured error responses.
 */
export class CvUploadException extends HttpException {
  constructor(code: CvUploadErrorCode, message: string, details?: string) {
    const response: CvUploadErrorResponse = { code, message, details };

    const statusMap: Record<CvUploadErrorCode, HttpStatus> = {
      [CvUploadErrorCode.INVALID_FILE_TYPE]: HttpStatus.BAD_REQUEST,
      [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: HttpStatus.PAYLOAD_TOO_LARGE,
      [CvUploadErrorCode.FILE_CORRUPTED]: HttpStatus.UNPROCESSABLE_ENTITY,
      [CvUploadErrorCode.NETWORK_TIMEOUT]: HttpStatus.REQUEST_TIMEOUT,
      [CvUploadErrorCode.SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
      [CvUploadErrorCode.UNKNOWN_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    super(response, statusMap[code]);
  }
}

/**
 * Exception thrown when an uploaded file has an invalid/unsupported type.
 * Returns HTTP 400 Bad Request.
 */
export class InvalidFileTypeException extends CvUploadException {
  constructor(receivedType?: string) {
    super(
      CvUploadErrorCode.INVALID_FILE_TYPE,
      'Invalid file type',
      receivedType ? `Received: ${receivedType}` : undefined,
    );
  }
}

/**
 * Exception thrown when an uploaded file exceeds the maximum allowed size.
 * Returns HTTP 413 Payload Too Large.
 */
export class FileSizeExceededException extends CvUploadException {
  constructor(fileSize?: number, maxSize?: number) {
    super(
      CvUploadErrorCode.FILE_SIZE_EXCEEDED,
      'File size exceeded',
      fileSize && maxSize
        ? `File: ${Math.round(fileSize / 1024 / 1024)}MB, Max: ${Math.round(maxSize / 1024 / 1024)}MB`
        : undefined,
    );
  }
}

/**
 * Exception thrown when an uploaded file appears to be corrupted or unreadable.
 * Returns HTTP 422 Unprocessable Entity.
 */
export class FileCorruptedException extends CvUploadException {
  constructor() {
    super(
      CvUploadErrorCode.FILE_CORRUPTED,
      'File appears to be corrupted or unreadable',
    );
  }
}

/**
 * Exception thrown when a network timeout occurs during file upload.
 * Returns HTTP 408 Request Timeout.
 */
export class NetworkTimeoutException extends CvUploadException {
  constructor() {
    super(
      CvUploadErrorCode.NETWORK_TIMEOUT,
      'Network timeout occurred during file upload',
    );
  }
}

/**
 * Exception thrown when an internal server error occurs during file processing.
 * Returns HTTP 500 Internal Server Error.
 */
export class CvUploadServerException extends CvUploadException {
  constructor(details?: string) {
    super(
      CvUploadErrorCode.SERVER_ERROR,
      'An error occurred while processing the file',
      details,
    );
  }
}

/**
 * Exception thrown when an unknown error occurs during file upload.
 * Returns HTTP 500 Internal Server Error.
 */
export class UnknownUploadException extends CvUploadException {
  constructor(details?: string) {
    super(
      CvUploadErrorCode.UNKNOWN_ERROR,
      'An unknown error occurred during file upload',
      details,
    );
  }
}
