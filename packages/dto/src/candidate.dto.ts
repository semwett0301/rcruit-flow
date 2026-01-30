import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * DTO for creating a new candidate
 */
export class CreateCandidateDto {
  /**
   * Candidate's full name
   */
  @IsString({ message: 'Name must be a string' })
  name: string;

  /**
   * Candidate's email address
   */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}

/**
 * DTO for updating an existing candidate
 * All fields are optional to allow partial updates
 */
export class UpdateCandidateDto {
  /**
   * Candidate's full name
   */
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  /**
   * Candidate's email address
   */
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;
}
