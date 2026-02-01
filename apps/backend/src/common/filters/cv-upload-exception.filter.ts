/**
 * CV Upload Exception Filter
 *
 * This exception filter ensures consistent error response format for all
 * CV upload related operations. It catches CvUploadException and transforms
 * them into a standardized CvUploadErrorResponse format.
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { CvUploadErrorCode, CvUploadErrorResponse } from '@recruit-flow/dto';
import { CvUploadException } from '../exceptions/cv-upload.exception';

/**
 * Comprehensive exception filter for CV upload operations.
 * Catches all exceptions and returns them in the standardized
 * CvUploadErrorResponse format.
 *
 * This filter handles:
 * - CvUploadException: Custom CV upload errors with specific error codes
 * - HttpException: Standard NestJS HTTP exceptions mapped to CV error codes
 * - Unknown errors: Unexpected exceptions with generic error response
 *
 * @example
 * // Apply to a specific controller
 * @UseFilters(CvUploadExceptionFilter)
 * @Controller('cv')
 * export class CvController {}
 *
 * @example
 * // Apply to a specific route
 * @Post('upload')
 * @UseFilters(CvUploadExceptionFilter)
 * async uploadCv() {}
 */
@Catch()
export class CvUploadExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CvUploadExceptionFilter.name);

  /**
   * Catches and handles all exceptions, returning a consistent
   * CV upload error response format.
   *
   * @param exception - The caught exception (any type)
   * @param host - The arguments host containing request/response context
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Handle CvUploadException - our custom exception type
    if (exception instanceof CvUploadException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse() as CvUploadErrorResponse;

      this.logger.warn(`CV Upload Error: ${errorResponse.code}`, {
        code: errorResponse.code,
        status,
        details: errorResponse.details,
      });

      response.status(status).json(errorResponse);
      return;
    }

    // Handle standard HttpException - map to CV upload error codes
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;

      // Map common HTTP errors to CV upload error codes
      const errorCode = this.mapHttpStatusToErrorCode(status);

      this.logger.warn(
        `HTTP Exception during CV upload: ${status} - ${message}`,
        { status, errorCode },
      );

      const errorResponse: CvUploadErrorResponse = {
        code: errorCode,
        message,
      };

      response.status(status).json(errorResponse);
      return;
    }

    // Handle unexpected errors
    this.logger.error(
      'Unexpected CV upload error:',
      exception instanceof Error ? exception.stack : String(exception),
    );

    const errorResponse: CvUploadErrorResponse = {
      code: CvUploadErrorCode.SERVER_ERROR,
      message: 'An unexpected error occurred',
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }

  /**
   * Maps HTTP status codes to appropriate CV upload error codes.
   *
   * @param status - The HTTP status code
   * @returns The corresponding CvUploadErrorCode
   */
  private mapHttpStatusToErrorCode(status: number): CvUploadErrorCode {
    if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      return CvUploadErrorCode.FILE_SIZE_EXCEEDED;
    }

    if (status === HttpStatus.UNSUPPORTED_MEDIA_TYPE) {
      return CvUploadErrorCode.INVALID_FILE_TYPE;
    }

    if (status === HttpStatus.REQUEST_TIMEOUT) {
      return CvUploadErrorCode.NETWORK_TIMEOUT;
    }

    if (status >= 500) {
      return CvUploadErrorCode.SERVER_ERROR;
    }

    return CvUploadErrorCode.UNKNOWN_ERROR;
  }
}
