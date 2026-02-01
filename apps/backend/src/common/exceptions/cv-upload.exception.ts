/**
 * Custom exceptions for CV upload errors.
 * Provides structured error responses for various CV upload failure scenarios.
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  CvUploadErrorCode,
  CvUploadErrorResponse,
  CV_UPLOAD_CONSTRAINTS,
} from '@recruit-flow/dto';

/**
 * Base exception class for CV upload related errors.
 * Extends NestJS HttpException to provide structured error responses
 * with specific error codes, messages, and constraint details.
 */
export class CvUploadException extends HttpException {
  constructor(code: CvUploadErrorCode, message?: string) {
    const response: CvUploadErrorResponse = {
      code,
      message: message || CvUploadException.getDefaultMessage(code),
      details: CvUploadException.getDetails(code),
    };
    super(response, CvUploadException.getHttpStatus(code));
  }

  private static getDefaultMessage(code: CvUploadErrorCode): string {
    const messages: Record<CvUploadErrorCode, string> = {
      [CvUploadErrorCode.INVALID_FILE_TYPE]: 'Invalid file type',
      [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: 'File size exceeded',
      [CvUploadErrorCode.FILE_CORRUPTED]: 'File is corrupted or unreadable',
      [CvUploadErrorCode.SERVER_ERROR]: 'Server processing error',
      [CvUploadErrorCode.NETWORK_TIMEOUT]: 'Request timeout',
      [CvUploadErrorCode.UNKNOWN_ERROR]: 'Unknown error occurred',
    };
    return messages[code];
  }

  private static getHttpStatus(code: CvUploadErrorCode): HttpStatus {
    switch (code) {
      case CvUploadErrorCode.INVALID_FILE_TYPE:
      case CvUploadErrorCode.FILE_SIZE_EXCEEDED:
      case CvUploadErrorCode.FILE_CORRUPTED:
        return HttpStatus.BAD_REQUEST;
      case CvUploadErrorCode.NETWORK_TIMEOUT:
        return HttpStatus.REQUEST_TIMEOUT;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private static getDetails(
    code: CvUploadErrorCode,
  ): CvUploadErrorResponse['details'] {
    return {
      maxSize: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
      allowedTypes: CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
      retryable: [
        CvUploadErrorCode.SERVER_ERROR,
        CvUploadErrorCode.NETWORK_TIMEOUT,
      ].includes(code),
    };
  }
}

/**
 * Exception thrown when an uploaded file has an invalid/unsupported file type.
 */
export class InvalidFileTypeException extends CvUploadException {
  constructor(message?: string) {
    super(
      CvUploadErrorCode.INVALID_FILE_TYPE,
      message || 'Invalid file type. Please upload a PDF, DOC, or DOCX file.',
    );
  }
}

/**
 * Exception thrown when an uploaded file exceeds the maximum allowed size.
 */
export class FileSizeExceededException extends CvUploadException {
  constructor(message?: string) {
    super(
      CvUploadErrorCode.FILE_SIZE_EXCEEDED,
      message ||
        `File size exceeds the maximum allowed size of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB.`,
    );
  }
}

/**
 * Exception thrown when an uploaded file appears to be corrupted or unreadable.
 */
export class FileCorruptedException extends CvUploadException {
  constructor(message?: string) {
    super(
      CvUploadErrorCode.FILE_CORRUPTED,
      message ||
        'The uploaded file appears to be corrupted or unreadable. Please try uploading a different file.',
    );
  }
}

/**
 * Exception thrown when a network timeout occurs during file upload.
 */
export class NetworkTimeoutException extends CvUploadException {
  constructor(message?: string) {
    super(
      CvUploadErrorCode.NETWORK_TIMEOUT,
      message || 'Request timed out. Please try again.',
    );
  }
}

/**
 * Exception thrown when an unexpected server error occurs during CV upload.
 */
export class CvServerException extends CvUploadException {
  constructor(message?: string) {
    super(
      CvUploadErrorCode.SERVER_ERROR,
      message || 'An unexpected server error occurred. Please try again later.',
    );
  }
}

/**
 * Exception thrown when an unknown error occurs during CV upload.
 */
export class CvUnknownException extends CvUploadException {
  constructor(message?: string) {
    super(
      CvUploadErrorCode.UNKNOWN_ERROR,
      message || 'An unknown error occurred. Please try again.',
    );
  }
}
