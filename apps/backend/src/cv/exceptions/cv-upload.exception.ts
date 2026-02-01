/**
 * Custom exceptions for CV upload failures.
 * Provides structured error responses with specific error codes for different upload failure scenarios.
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { CvUploadErrorCode, CvUploadErrorResponse } from '@rcruit-flow/dto';

/**
 * Custom exception class for CV upload failures.
 * Extends NestJS HttpException to provide structured error responses
 * with specific error codes and details for client-side handling.
 */
export class CvUploadException extends HttpException {
  constructor(errorResponse: CvUploadErrorResponse, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(errorResponse, status);
  }

  /**
   * Creates an exception for invalid file type uploads.
   * @param currentType - The MIME type of the uploaded file
   * @param allowedTypes - Array of allowed MIME types
   * @returns CvUploadException with INVALID_FILE_TYPE error code
   */
  static invalidFileType(currentType: string, allowedTypes: string[]): CvUploadException {
    return new CvUploadException({
      code: CvUploadErrorCode.INVALID_FILE_TYPE,
      message: 'Invalid file type',
      details: { currentType, allowedTypes }
    });
  }

  /**
   * Creates an exception for files exceeding the maximum allowed size.
   * @param currentSize - The size of the uploaded file in bytes
   * @param maxSize - The maximum allowed file size in bytes
   * @returns CvUploadException with FILE_SIZE_EXCEEDED error code
   */
  static fileSizeExceeded(currentSize: number, maxSize: number): CvUploadException {
    return new CvUploadException({
      code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
      message: 'File size exceeded',
      details: { currentSize, maxSize }
    });
  }

  /**
   * Creates an exception for corrupted or unreadable files.
   * @returns CvUploadException with FILE_CORRUPTED error code
   */
  static fileCorrupted(): CvUploadException {
    return new CvUploadException({
      code: CvUploadErrorCode.FILE_CORRUPTED,
      message: 'File is corrupted or unreadable'
    });
  }

  /**
   * Creates an exception for internal server errors during file processing.
   * @returns CvUploadException with SERVER_ERROR error code and 500 status
   */
  static serverError(): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.SERVER_ERROR,
        message: 'Internal server error during file processing'
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
