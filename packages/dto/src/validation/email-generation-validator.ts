/**
 * Email Generation Validation Utilities
 *
 * This module provides validation functions for email generation inputs,
 * including candidate data and job description validation.
 */

import {
  CandidateData,
  JobDescription,
  EmailGenerationInput,
  ValidationResult,
  ValidationError,
  REQUIRED_CANDIDATE_FIELDS,
  REQUIRED_JOB_FIELDS,
} from './email-generation-validation';

/**
 * Validates candidate data for email generation.
 *
 * @param candidate - The candidate data to validate, or null if not provided
 * @returns An array of validation errors, empty if validation passes
 */
export function validateCandidateData(candidate: CandidateData | null): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!candidate) {
    errors.push({
      field: 'candidate',
      message: 'Candidate data is required. Please upload or enter candidate information.',
    });
    return errors;
  }

  for (const field of REQUIRED_CANDIDATE_FIELDS) {
    if (!candidate[field] || candidate[field].trim() === '') {
      errors.push({
        field: `candidate.${field}`,
        message: `Candidate ${field} is required.`,
      });
    }
  }

  if (candidate.email && !isValidEmail(candidate.email)) {
    errors.push({
      field: 'candidate.email',
      message: 'Please enter a valid email address for the candidate.',
    });
  }

  return errors;
}

/**
 * Validates job description data for email generation.
 *
 * @param jobDescription - The job description to validate, or null if not provided
 * @returns An array of validation errors, empty if validation passes
 */
export function validateJobDescription(jobDescription: JobDescription | null): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!jobDescription) {
    errors.push({
      field: 'jobDescription',
      message: 'Job description is required. Please enter job details.',
    });
    return errors;
  }

  for (const field of REQUIRED_JOB_FIELDS) {
    if (!jobDescription[field] || jobDescription[field].trim() === '') {
      errors.push({
        field: `jobDescription.${field}`,
        message: `Job ${field} is required.`,
      });
    }
  }

  return errors;
}

/**
 * Validates the complete email generation input.
 *
 * @param input - The email generation input containing candidate and job description
 * @returns A validation result indicating whether the input is valid and any errors
 */
export function validateEmailGenerationInput(input: EmailGenerationInput): ValidationResult {
  const errors: ValidationError[] = [
    ...validateCandidateData(input.candidate),
    ...validateJobDescription(input.jobDescription),
  ];

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates an email address format.
 *
 * @param email - The email address to validate
 * @returns True if the email format is valid, false otherwise
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
