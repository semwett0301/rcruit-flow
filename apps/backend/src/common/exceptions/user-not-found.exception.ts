/**
 * Custom exception for user not found scenarios.
 * Extends NestJS NotFoundException to provide consistent error responses
 * when a user cannot be found by their ID.
 */
import { NotFoundException } from '@nestjs/common';

/**
 * Exception thrown when a user is not found in the system.
 *
 * @example
 * ```typescript
 * throw new UserNotFoundException(123);
 * // Response: { statusCode: 404, message: 'User with ID 123 not found', error: 'Not Found' }
 * ```
 */
export class UserNotFoundException extends NotFoundException {
  /**
   * Creates a new UserNotFoundException.
   *
   * @param userId - The ID of the user that was not found (string or number)
   */
  constructor(userId: string | number) {
    super({
      statusCode: 404,
      message: `User with ID ${userId} not found`,
      error: 'Not Found',
    });
  }
}
