/**
 * Validation Exception Filter
 *
 * Custom exception filter that catches BadRequestException errors
 * (typically thrown by validation pipes) and formats them into a
 * consistent, user-friendly error response structure.
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Interface for structured validation error
 */
interface ValidationError {
  field: string;
  message: string;
}

/**
 * Interface for the formatted error response
 */
interface ValidationErrorResponse {
  statusCode: number;
  message: string;
  errors: ValidationError[];
  timestamp: string;
}

/**
 * ValidationExceptionFilter
 *
 * Catches BadRequestException instances and transforms them into
 * a standardized validation error response format.
 *
 * @example
 * // Usage in a controller or globally
 * @UseFilters(ValidationExceptionFilter)
 * export class UsersController { ... }
 *
 * // Or register globally in main.ts
 * app.useGlobalFilters(new ValidationExceptionFilter());
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  /**
   * Handles the caught BadRequestException and formats the response
   *
   * @param exception - The caught BadRequestException
   * @param host - The arguments host containing request/response context
   */
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse() as Record<string, unknown>;

    // Extract errors from the exception response
    // NestJS validation pipe returns errors in 'message' property
    const errors = this.extractErrors(exceptionResponse);

    const errorResponse: ValidationErrorResponse = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed. Please check the required fields.',
      errors,
      timestamp: new Date().toISOString(),
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }

  /**
   * Extracts and normalizes validation errors from the exception response
   *
   * @param exceptionResponse - The raw exception response object
   * @returns Array of normalized validation errors
   */
  private extractErrors(exceptionResponse: Record<string, unknown>): ValidationError[] {
    const rawErrors = exceptionResponse.errors || exceptionResponse.message;

    // If errors is already an array, process each item
    if (Array.isArray(rawErrors)) {
      return rawErrors.map((error) => this.normalizeError(error));
    }

    // If it's a string or other type, wrap it in a standard format
    return [{ field: 'unknown', message: String(rawErrors) }];
  }

  /**
   * Normalizes a single error into the ValidationError format
   *
   * @param error - The raw error (string or object)
   * @returns Normalized ValidationError object
   */
  private normalizeError(error: unknown): ValidationError {
    if (typeof error === 'string') {
      return { field: 'unknown', message: error };
    }

    if (typeof error === 'object' && error !== null) {
      const errorObj = error as Record<string, unknown>;
      return {
        field: String(errorObj.field || errorObj.property || 'unknown'),
        message: String(errorObj.message || errorObj.constraints || 'Validation error'),
      };
    }

    return { field: 'unknown', message: 'Validation error' };
  }
}
