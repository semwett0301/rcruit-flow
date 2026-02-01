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
   * error response format.
   *
   * @param exception - The caught exception
   * @param host - The arguments host containing request/response context
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: CvUploadErrorResponse;

    if (exception instanceof CvUploadException) {
      // Handle custom CV upload exceptions
      status = exception.getStatus();
      errorResponse = exception.getResponse() as CvUploadErrorResponse;
      this.logger.warn(
        `CV Upload Exception: ${errorResponse.code} - ${errorResponse.message}`,
      );
    } else if (exception instanceof HttpException) {
      // Handle standard NestJS HTTP exceptions
      status = exception.getStatus();
      errorResponse = {
        code: CvUploadErrorCode.SERVER_ERROR,
        message: exception.message,
      };
      this.logger.warn(
        `HTTP Exception during CV upload: ${status} - ${exception.message}`,
      );
    } else {
      // Handle unexpected errors
      errorResponse = {
        code: CvUploadErrorCode.SERVER_ERROR,
        message: 'An unexpected error occurred',
      };

      // Log the full error for debugging purposes
      this.logger.error(
        'Unexpected error during CV upload',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(errorResponse);
  }
}
