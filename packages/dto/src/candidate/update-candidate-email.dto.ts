/**
 * DTO for updating a candidate's email address.
 * Provides validation for email format and required fields.
 */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object for updating candidate email.
 * Validates that the email is a non-empty string with valid email format.
 */
export class UpdateCandidateEmailDto {
  /**
   * The new email address for the candidate.
   * Must be a valid email format.
   */
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
