/**
 * Custom exceptions for CV upload errors.
 * Provides structured error responses for various CV upload failure scenarios.
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  CvUploadErrorCode,
  CvUploadErrorResponse,
  CV_UPLOAD_CONSTRAINTS,
} from '@rcruit-flow/dto';

/**
 * Base exception class for CV upload related errors.
 * Extends NestJS HttpException to provide structured error responses
 * with specific error codes, messages, and constraint details.
 */
export class CvUploadException extends HttpException {
  constructor(
    code: CvUploadErrorCode,
    details?: CvUploadErrorResponse['details'],
  ) {
    const errorResponse = CvUploadException.buildErrorResponse(code, details);
    const httpStatus = CvUploadException.getHttpStatus(code);
    super(errorResponse, httpStatus);
  }

  /**
   * Builds a structured error response with error code, message, and details.
   * Automatically includes upload constraints (allowed types, max size) in details.
   */
  private static buildErrorResponse(
    code: CvUploadErrorCode,
    details?: CvUploadErrorResponse['details'],
  ): CvUploadErrorResponse {
    return {
      code,
      message: CvUploadException.getInternalMessage(code),
      details: {
        ...details,
        allowedTypes: CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
        maxSizeBytes: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
        maxSizeMB: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB,
      },
    };
  }

  /**
   * Maps error codes to appropriate HTTP status codes.
   * - BAD_REQUEST (400): Client-side validation errors (invalid type, size, empty)
   * - UNPROCESSABLE_ENTITY (422): File processing errors (corrupted, parsing)
   * - REQUEST_TIMEOUT (408): Network/timeout errors
   * - INTERNAL_SERVER_ERROR (500): Server-side errors
   */
  private static getHttpStatus(code: CvUploadErrorCode): HttpStatus {
    switch (code) {
      case CvUploadErrorCode.INVALID_FILE_TYPE:
      case CvUploadErrorCode.FILE_TOO_LARGE:
      case CvUploadErrorCode.EMPTY_FILE:
      case CvUploadErrorCode.UNSUPPORTED_FORMAT:
        return HttpStatus.BAD_REQUEST;
      case CvUploadErrorCode.FILE_CORRUPTED:
      case CvUploadErrorCode.PROCESSING_ERROR:
        return HttpStatus.UNPROCESSABLE_ENTITY;
      case CvUploadErrorCode.NETWORK_TIMEOUT:
        return HttpStatus.REQUEST_TIMEOUT;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Returns internal error messages for logging and debugging.
   * These messages provide context for each error code.
   */
  private static getInternalMessage(code: CvUploadErrorCode): string {
    const messages: Record<CvUploadErrorCode, string> = {
      [CvUploadErrorCode.INVALID_FILE_TYPE]: 'Invalid file type uploaded',
      [CvUploadErrorCode.FILE_TOO_LARGE]: 'File exceeds size limit',
      [CvUploadErrorCode.FILE_CORRUPTED]: 'File appears to be corrupted',
      [CvUploadErrorCode.PROCESSING_ERROR]: 'Error processing file',
      [CvUploadErrorCode.NETWORK_TIMEOUT]: 'Upload timed out',
      [CvUploadErrorCode.SERVER_ERROR]: 'Server error during upload',
      [CvUploadErrorCode.PARTIAL_UPLOAD]: 'File was only partially uploaded',
      [CvUploadErrorCode.UNSUPPORTED_FORMAT]: 'File format not supported',
      [CvUploadErrorCode.EMPTY_FILE]: 'Uploaded file is empty',
      [CvUploadErrorCode.UNKNOWN_ERROR]: 'Unknown upload error',
    };
    return messages[code];
  }
}
