/**
 * Email Generation Input Validation
 *
 * This module provides shared validation logic for email generation inputs,
 * including candidate data and job description validation.
 */

import {
  CandidateData,
  JobDescription,
  EmailGenerationInput,
  ValidationResult,
  ValidationError,
} from './email-generation.validation';

/**
 * Validates an email address format using a basic regex pattern.
 *
 * @param email - The email address to validate
 * @returns True if the email format is valid, false otherwise
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates candidate data for email generation.
 *
 * @param candidate - The candidate data to validate (can be partial, null, or undefined)
 * @returns An array of validation errors (empty if valid)
 */
export function validateCandidateData(
  candidate: Partial<CandidateData> | null | undefined
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!candidate) {
    errors.push({ field: 'candidate', message: 'Candidate data is required' });
    return errors;
  }

  if (!candidate.name || candidate.name.trim() === '') {
    errors.push({ field: 'candidate.name', message: 'Candidate name is required' });
  }

  if (!candidate.email || candidate.email.trim() === '') {
    errors.push({ field: 'candidate.email', message: 'Candidate email is required' });
  } else if (!isValidEmail(candidate.email)) {
    errors.push({ field: 'candidate.email', message: 'Candidate email is invalid' });
  }

  return errors;
}

/**
 * Validates job description data for email generation.
 *
 * @param job - The job description to validate (can be partial, null, or undefined)
 * @returns An array of validation errors (empty if valid)
 */
export function validateJobDescription(
  job: Partial<JobDescription> | null | undefined
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!job) {
    errors.push({ field: 'jobDescription', message: 'Job description is required' });
    return errors;
  }

  if (!job.title || job.title.trim() === '') {
    errors.push({ field: 'jobDescription.title', message: 'Job title is required' });
  }

  if (!job.description || job.description.trim() === '') {
    errors.push({ field: 'jobDescription.description', message: 'Job description text is required' });
  }

  return errors;
}

/**
 * Validates the complete email generation input.
 *
 * Combines validation of candidate data and job description into a single
 * validation result.
 *
 * @param input - The email generation input to validate (can be partial, null, or undefined)
 * @returns A validation result containing isValid flag and any errors
 */
export function validateEmailGenerationInput(
  input: Partial<EmailGenerationInput> | null | undefined
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!input) {
    return {
      isValid: false,
      errors: [{ field: 'input', message: 'Email generation input is required' }],
    };
  }

  errors.push(...validateCandidateData(input.candidate));
  errors.push(...validateJobDescription(input.jobDescription));

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Formats validation errors into a human-readable string.
 *
 * @param errors - Array of validation errors to format
 * @returns A comma-separated string of error messages
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map((e) => e.message).join(', ');
}
