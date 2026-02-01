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
  constructor(
    code: CvUploadErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ) {
    const response: CvUploadErrorResponse = {
      code,
      message,
      details: {
        ...details,
        allowedTypes: CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
        maxSizeBytes: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
        maxSizeMB: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB,
      },
    };

    const statusMap: Record<CvUploadErrorCode, HttpStatus> = {
      [CvUploadErrorCode.INVALID_FILE_TYPE]: HttpStatus.BAD_REQUEST,
      [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: HttpStatus.PAYLOAD_TOO_LARGE,
      [CvUploadErrorCode.CORRUPTED_FILE]: HttpStatus.UNPROCESSABLE_ENTITY,
      [CvUploadErrorCode.SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
      [CvUploadErrorCode.NETWORK_ERROR]: HttpStatus.SERVICE_UNAVAILABLE,
      [CvUploadErrorCode.PARSING_ERROR]: HttpStatus.UNPROCESSABLE_ENTITY,
      [CvUploadErrorCode.UNKNOWN_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    super(response, statusMap[code]);
  }
}

/**
 * Exception thrown when an uploaded file has an invalid/unsupported file type.
 */
export class InvalidFileTypeException extends CvUploadException {
  constructor(receivedType: string) {
    super(
      CvUploadErrorCode.INVALID_FILE_TYPE,
      'Invalid file type. Please upload a PDF, DOC, or DOCX file.',
      { receivedType },
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
      `File size (${Math.round(fileSize / 1024 / 1024)}MB) exceeds the maximum allowed size (${Math.round(maxSize / 1024 / 1024)}MB).`,
      { fileSize, maxSize },
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
      'The uploaded file appears to be corrupted or unreadable. Please try uploading a different file.',
    );
  }
}

/**
 * Exception thrown when CV parsing fails due to content extraction issues.
 */
export class CvParsingException extends CvUploadException {
  constructor(reason?: string) {
    super(
      CvUploadErrorCode.PARSING_ERROR,
      'Failed to parse CV content. Please ensure the file contains readable text.',
      reason ? { reason } : undefined,
    );
  }
}

/**
 * Exception thrown when a network error occurs during file upload.
 */
export class CvNetworkException extends CvUploadException {
  constructor(reason?: string) {
    super(
      CvUploadErrorCode.NETWORK_ERROR,
      'A network error occurred during upload. Please try again.',
      reason ? { reason } : undefined,
    );
  }
}

/**
 * Exception thrown when an unexpected server error occurs during CV upload.
 */
export class CvServerException extends CvUploadException {
  constructor(reason?: string) {
    super(
      CvUploadErrorCode.SERVER_ERROR,
      'An unexpected server error occurred. Please try again later.',
      reason ? { reason } : undefined,
    );
  }
}
