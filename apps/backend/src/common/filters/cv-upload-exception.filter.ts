/**
 * CV Upload Exception Filter
 *
 * This exception filter ensures consistent error response format for all
 * CV upload related operations. It catches all exceptions and transforms
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
import { CvUploadErrorCode, CvUploadErrorResponse } from '@rcruit-flow/dto';
import { CvUploadException } from '../exceptions/cv-upload.exception';

/**
 * Exception filter that catches all exceptions during CV upload operations
 * and transforms them into a consistent CvUploadErrorResponse format.
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
   * Catches and handles exceptions, transforming them into a consistent
   * error response format with timestamp.
   *
   * @param exception - The caught exception
   * @param host - The arguments host containing request/response context
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const timestamp = new Date().toISOString();

    if (exception instanceof CvUploadException) {
      // Handle custom CV upload exceptions
      const status = exception.getStatus();
      const errorResponse = exception.getResponse() as {
        code: CvUploadErrorCode;
        message: string;
      };

      this.logger.warn(
        `CV Upload Exception: ${errorResponse.code} - ${errorResponse.message}`,
      );

      response.status(status).json({
        code: errorResponse.code,
        message: errorResponse.message,
        timestamp,
      });
      return;
    }

    if (exception instanceof HttpException) {
      // Handle standard NestJS HTTP exceptions
      const status = exception.getStatus();

      this.logger.warn(
        `HTTP Exception during CV upload: ${status} - ${exception.message}`,
      );

      response.status(status).json({
        code: CvUploadErrorCode.SERVER_ERROR,
        message: 'An error occurred while processing your request',
        timestamp,
      });
      return;
    }

    // Handle unexpected errors
    this.logger.error(
      'Unexpected error during CV upload',
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: CvUploadErrorCode.SERVER_ERROR,
      message: 'An unexpected error occurred',
      timestamp,
    });
  }
}
