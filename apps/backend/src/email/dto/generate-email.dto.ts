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
  @IsString()
  @IsNotEmpty({ message: 'Candidate name is required' })
  name: string;

  @IsEmail({}, { message: 'Valid candidate email is required' })
  @IsNotEmpty({ message: 'Candidate email is required' })
  email: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  resumeText?: string;
}

/**
 * DTO for job description information used in email generation.
 */
export class JobDescriptionDto {
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Job description is required' })
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsString()
  company?: string;
}

/**
 * DTO for email generation request payload.
 * Validates candidate data and job description required for generating personalized emails.
 */
export class GenerateEmailDto {
  @ValidateNested()
  @Type(() => CandidateDataDto)
  @IsNotEmpty({ message: 'Candidate data is required' })
  candidate: CandidateDataDto;

  @ValidateNested()
  @Type(() => JobDescriptionDto)
  @IsNotEmpty({ message: 'Job description is required' })
  jobDescription: JobDescriptionDto;
}
