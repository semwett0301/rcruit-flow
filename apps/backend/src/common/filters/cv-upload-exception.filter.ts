/**
 * CV Upload Exception Filter
 *
 * This exception filter handles all errors that occur during CV upload operations
 * and returns structured error responses to the client.
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
 * and transforms them into structured CvUploadErrorResponse objects.
 *
 * @example
 * // Apply to a specific controller method
 * @UseFilters(CvUploadExceptionFilter)
 * @Post('upload')
 * async uploadCv(@UploadedFile() file: Express.Multer.File) { ... }
 *
 * @example
 * // Apply to an entire controller
 * @UseFilters(CvUploadExceptionFilter)
 * @Controller('cv')
 * export class CvController { ... }
 */
@Catch()
export class CvUploadExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CvUploadExceptionFilter.name);

  /**
   * Catches and handles exceptions, transforming them into structured error responses.
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
      // Handle custom CV upload exceptions
      errorResponse = exception.getResponse() as CvUploadErrorResponse;
      status = exception.getStatus();
    } else if (exception instanceof HttpException) {
      // Handle generic HTTP exceptions
      status = exception.getStatus();
      errorResponse = {
        code: CvUploadErrorCode.SERVER_ERROR,
        message: 'An error occurred during file upload',
      };
    } else {
      // Handle unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        code: CvUploadErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred',
      };

      // Log the actual error for debugging purposes
      this.logger.error(
        'Unexpected CV upload error',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(errorResponse);
  }
}
