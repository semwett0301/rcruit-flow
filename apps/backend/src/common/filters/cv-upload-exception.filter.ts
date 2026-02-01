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
 * Exception filter specifically for CvUploadException.
 * Catches CV upload specific exceptions and returns them in the
 * standardized CvUploadErrorResponse format.
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
@Catch(CvUploadException)
export class CvUploadExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CvUploadExceptionFilter.name);

  /**
   * Catches and handles CvUploadException, returning a consistent
   * error response format.
   *
   * @param exception - The caught CvUploadException
   * @param host - The arguments host containing request/response context
   */
  catch(exception: CvUploadException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as CvUploadErrorResponse;

    this.logger.warn(`CV Upload Error: ${errorResponse.code}`, {
      code: errorResponse.code,
      status,
      details: errorResponse.details,
    });

    response.status(status).json(errorResponse);
  }
}

/**
 * Generic HTTP exception filter for non-CV upload errors that might occur
 * during upload operations. Converts standard HTTP exceptions to the
 * CV upload error format for consistency.
 *
 * @example
 * // Apply alongside CvUploadExceptionFilter for complete coverage
 * @UseFilters(CvUploadExceptionFilter, HttpExceptionFilter)
 * @Controller('cv')
 * export class CvController {}
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * Catches and handles generic HttpException, converting them to
   * the CV upload error response format.
   *
   * @param exception - The caught HttpException
   * @param host - The arguments host containing request/response context
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logger.warn(
      `HTTP Exception during CV upload: ${status} - ${exception.message}`,
    );

    // Convert generic HTTP exceptions to CV upload error format if in upload context
    const errorResponse: CvUploadErrorResponse = {
      code: CvUploadErrorCode.SERVER_ERROR,
      message: exception.message,
    };

    response.status(status).json(errorResponse);
  }
}

/**
 * Catch-all exception filter for unexpected errors during CV upload operations.
 * This filter should be applied last to catch any unhandled exceptions.
 *
 * @example
 * // Apply as the last filter for complete error coverage
 * @UseFilters(CvUploadExceptionFilter, HttpExceptionFilter, CvUploadCatchAllExceptionFilter)
 * @Controller('cv')
 * export class CvController {}
 */
@Catch()
export class CvUploadCatchAllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CvUploadCatchAllExceptionFilter.name);

  /**
   * Catches and handles any unexpected exceptions, transforming them into
   * a consistent error response format.
   *
   * @param exception - The caught exception
   * @param host - The arguments host containing request/response context
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorResponse: CvUploadErrorResponse;
    let status: HttpStatus;

    if (exception instanceof CvUploadException) {
      status = exception.getStatus();
      errorResponse = exception.getResponse() as CvUploadErrorResponse;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorResponse = {
        code: CvUploadErrorCode.SERVER_ERROR,
        message: exception.message,
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        code: CvUploadErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred',
      };
    }

    // Log the actual error for debugging
    this.logger.error(
      'Unexpected CV upload error:',
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json(errorResponse);
  }
}
