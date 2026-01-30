/**
 * DTOs for email generation requests.
 * Contains validation decorators for candidate data, job description, and email generation payloads.
 */
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for candidate information used in email generation.
 */
export class CandidateDataDto {
  @IsNotEmpty({ message: 'Candidate name is required and cannot be empty.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Candidate email is required and cannot be empty.' })
  @IsEmail({}, { message: 'Candidate email must be a valid email address.' })
  email: string;

  @IsOptional()
  @IsString()
  resume?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}

/**
 * DTO for job description information used in email generation.
 */
export class JobDescriptionDto {
  @IsNotEmpty({ message: 'Job title is required and cannot be empty.' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Job description is required and cannot be empty.' })
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];
}

/**
 * DTO for email generation request payload.
 * Validates candidate data and job description required for generating personalized emails.
 */
export class GenerateEmailDto {
  @ValidateNested()
  @Type(() => CandidateDataDto)
  @IsNotEmpty({ message: 'Candidate data is required. Please upload or enter candidate information.' })
  candidateData: CandidateDataDto;

  @ValidateNested()
  @Type(() => JobDescriptionDto)
  @IsNotEmpty({ message: 'Job description is required. Please enter job details.' })
  jobDescription: JobDescriptionDto;
}
