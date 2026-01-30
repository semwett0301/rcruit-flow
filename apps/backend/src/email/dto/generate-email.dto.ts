/**
 * DTOs for email generation requests.
 * Contains validation decorators for candidate data, job descriptions,
 * and the main email generation request payload.
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
 * DTO for candidate information.
 * Contains personal details and professional background.
 */
export class CandidateDataDto {
  @IsNotEmpty({ message: 'Candidate name is required.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Candidate email is required.' })
  @IsEmail(
    {},
    { message: 'Please provide a valid email address for the candidate.' },
  )
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  education?: string;
}

/**
 * DTO for job description details.
 * Contains job title, company, and requirements.
 */
export class JobDescriptionDto {
  @IsNotEmpty({ message: 'Job title is required.' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Company name is required.' })
  @IsString()
  company: string;

  @IsNotEmpty({ message: 'Job description is required.' })
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];
}

/**
 * Main DTO for email generation requests.
 * Combines candidate data and job description for generating personalized emails.
 */
export class GenerateEmailDto {
  @IsNotEmpty({
    message:
      'Candidate data is required. Please upload or enter candidate information.',
  })
  @ValidateNested()
  @Type(() => CandidateDataDto)
  candidate: CandidateDataDto;

  @IsNotEmpty({
    message: 'Job description is required. Please enter job details.',
  })
  @ValidateNested()
  @Type(() => JobDescriptionDto)
  jobDescription: JobDescriptionDto;
}
