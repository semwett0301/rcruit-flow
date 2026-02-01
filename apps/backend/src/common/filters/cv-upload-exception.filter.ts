/**
 * CV Upload Exception Filter
 *
 * This filter handles all exceptions related to CV upload operations,
 * providing consistent error responses across the application.
 *
 * It specifically handles:
 * - CvUploadException: Custom exceptions with specific error codes
 * - Multer errors: File size exceeded errors
 * - Unexpected errors: Generic server errors with retry information
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { CvUploadException } from '../exceptions/cv-upload.exception';
import { CvUploadErrorCode, CvUploadErrorResponse } from '@rcruit-flow/dto';

@Catch()
export class CvUploadExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CvUploadExceptionFilter.name);

  /**
   * Catches and handles exceptions thrown during CV upload operations.
   *
   * @param exception - The exception that was thrown
   * @param host - The arguments host containing request/response context
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Handle custom CV upload exceptions
    if (exception instanceof CvUploadException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse() as CvUploadErrorResponse;

      this.logger.warn(
        `CV upload error: ${errorResponse.code} - ${errorResponse.message}`,
      );

      response.status(status).json(errorResponse);
      return;
    }

    // Handle multer file size errors
    if (this.isFileTooLargeError(exception)) {
      this.logger.warn('CV upload failed: File size exceeded');

      const errorResponse: CvUploadErrorResponse = {
        code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
        message: 'File size exceeded the maximum allowed limit',
      };

      response.status(HttpStatus.PAYLOAD_TOO_LARGE).json(errorResponse);
      return;
    }

    // Log unexpected errors with full stack trace for debugging
    this.logger.error(
      'Unexpected CV upload error',
      exception instanceof Error ? exception.stack : exception,
    );

    // Return generic server error for unexpected exceptions
    const errorResponse: CvUploadErrorResponse = {
      code: CvUploadErrorCode.SERVER_ERROR,
      message: 'An unexpected error occurred during CV upload',
      details: {
        retryable: true,
      },
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }

  /**
   * Checks if the exception is a file too large error from multer.
   *
   * @param exception - The exception to check
   * @returns True if the exception is a file too large error
   */
  private isFileTooLargeError(exception: unknown): boolean {
    if (!(exception instanceof Error)) {
      return false;
    }

    // Check for multer's file size error message
    return (
      exception.message.includes('File too large') ||
      exception.message.includes('LIMIT_FILE_SIZE')
    );
  }
}
