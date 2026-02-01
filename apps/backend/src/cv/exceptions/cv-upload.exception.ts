/**
 * Custom exceptions for CV upload failures.
 * Provides structured error responses with specific error codes for different upload failure scenarios.
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { CvUploadErrorCode, CvUploadErrorResponse, CV_UPLOAD_CONSTRAINTS } from '@repo/dto';

/**
 * Custom exception class for CV upload failures.
 * Extends NestJS HttpException to provide structured error responses
 * with specific error codes and details for client-side handling.
 */
export class CvUploadException extends HttpException {
  constructor(errorResponse: CvUploadErrorResponse, status: HttpStatus) {
    super(errorResponse, status);
  }

  /**
   * Creates an exception for invalid file type uploads.
   * @param mimeType - The MIME type of the uploaded file
   * @returns CvUploadException with INVALID_FILE_TYPE error code
   */
  static invalidFileType(mimeType: string): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.INVALID_FILE_TYPE,
        message: 'Invalid file type',
        details: {
          allowedTypes: CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS
        }
      },
      HttpStatus.BAD_REQUEST
    );
  }

  /**
   * Creates an exception for files exceeding the maximum allowed size.
   * @param fileSize - The size of the uploaded file in bytes
   * @returns CvUploadException with FILE_SIZE_EXCEEDED error code
   */
  static fileSizeExceeded(fileSize: number): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
        message: 'File size exceeded',
        details: {
          maxSize: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB
        }
      },
      HttpStatus.PAYLOAD_TOO_LARGE
    );
  }

  /**
   * Creates an exception for corrupted or unreadable files.
   * @returns CvUploadException with FILE_CORRUPTED error code
   */
  static fileCorrupted(): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.FILE_CORRUPTED,
        message: 'File appears to be corrupted or unreadable',
        details: { retryable: false }
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }

  /**
   * Creates an exception for internal server errors during file processing.
   * @returns CvUploadException with SERVER_ERROR error code and 500 status
   */
  static serverError(): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.SERVER_ERROR,
        message: 'Server error occurred',
        details: { retryable: true }
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
