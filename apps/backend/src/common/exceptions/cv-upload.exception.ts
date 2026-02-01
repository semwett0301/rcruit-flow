/**
 * Custom exceptions for CV upload errors.
 * Provides structured error responses for various CV upload failure scenarios.
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { CvUploadErrorCode, CvUploadErrorResponse } from '@rcruit-flow/dto';

/**
 * Custom exception class for CV upload related errors.
 * Extends NestJS HttpException to provide structured error responses
 * with specific error codes and details.
 */
export class CvUploadException extends HttpException {
  constructor(
    errorResponse: CvUploadErrorResponse,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(errorResponse, status);
  }

  /**
   * Creates an exception for invalid file type uploads.
   * @param currentType - The MIME type or extension of the uploaded file
   * @returns CvUploadException with INVALID_FILE_TYPE error code
   */
  static invalidFileType(currentType: string): CvUploadException {
    return new CvUploadException({
      code: CvUploadErrorCode.INVALID_FILE_TYPE,
      message: 'Invalid file type',
      details: {
        allowedTypes: ['.pdf', '.doc', '.docx'],
        currentType,
      },
    });
  }

  /**
   * Creates an exception for files exceeding the maximum allowed size.
   * @param currentSize - The size of the uploaded file in bytes
   * @param maxSize - The maximum allowed file size in bytes
   * @returns CvUploadException with FILE_SIZE_EXCEEDED error code
   */
  static fileSizeExceeded(
    currentSize: number,
    maxSize: number,
  ): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
        message: 'File size exceeded',
        details: {
          maxSize,
          currentSize,
        },
      },
      HttpStatus.PAYLOAD_TOO_LARGE,
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
        message: 'File is corrupted or unreadable',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  /**
   * Creates an exception for internal server errors during file processing.
   * @returns CvUploadException with SERVER_ERROR error code
   */
  static serverError(): CvUploadException {
    return new CvUploadException(
      {
        code: CvUploadErrorCode.SERVER_ERROR,
        message: 'Internal server error during file processing',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
