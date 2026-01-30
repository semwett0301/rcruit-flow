/**
 * UpdateUserDto - Data Transfer Object for validating user update requests
 *
 * This DTO validates partial user updates where all fields are optional.
 * When provided, fields must meet their respective validation requirements.
 */
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  /**
   * User's display name
   * Optional field - when provided, must be a non-empty string
   */
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Name cannot be empty' })
  name?: string;

  /**
   * User's email address
   * Optional field - when provided, must be a valid email format
   */
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
}
