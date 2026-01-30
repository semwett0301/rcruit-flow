/**
 * DTOs for email generation requests.
 * Contains validation decorators for candidate data and email generation payloads.
 */
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  ValidateNested,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for candidate information used in email generation.
 */
export class CandidateDataDto {
  @IsNotEmpty({ message: 'Candidate name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Candidate email is required' })
  @IsEmail({}, { message: 'Invalid candidate email format' })
  email: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  experience?: string;
}

/**
 * DTO for email generation request payload.
 * Validates candidate data and job description required for generating personalized emails.
 */
export class GenerateEmailDto {
  @IsNotEmpty({ message: 'Candidate data is required for email generation' })
  @ValidateNested()
  @Type(() => CandidateDataDto)
  candidateData: CandidateDataDto;

  @IsNotEmpty({ message: 'Job description is required for email generation' })
  @IsString()
  jobDescription: string;
}
