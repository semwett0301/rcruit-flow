import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * Data Transfer Object for updating candidate information.
 * All fields are optional to support partial updates.
 */
export class UpdateCandidateDto {
  /**
   * Candidate's email address.
   * Must be a valid email format if provided.
   */
  @IsOptional()
  @IsString()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;
}
