/**
 * Email Generation Validation Module
 *
 * Provides shared validation logic for email generation inputs across the application.
 * Validates candidate data, job descriptions, and other required fields for email generation.
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
 * Checks if a value is empty, null, undefined, or contains only whitespace.
 *
 * @param value - The value to check
 * @returns true if the value is empty or whitespace-only, false otherwise
 */
const isEmptyOrWhitespace = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0 || value.every(item => isEmptyOrWhitespace(item));
  return false;
};

/**
 * Validates candidate data for email generation.
 *
 * @param data - The candidate data to validate
 * @returns Array of validation errors, empty if valid
 *
 * @example
 * ```typescript
 * const errors = validateCandidateData({ name: 'John Doe', email: 'john@example.com' });
 * if (errors.length > 0) {
 *   console.error('Candidate validation failed:', errors);
 * }
 * ```
 */
export const validateCandidateData = (data: CandidateData | null | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data) {
    errors.push({
      field: 'candidateData',
      message: 'Candidate data is required. Please upload or enter candidate information.',
    });
    return errors;
  }

  for (const field of REQUIRED_CANDIDATE_FIELDS) {
    if (isEmptyOrWhitespace(data[field])) {
      errors.push({
        field: `candidateData.${field}`,
        message: `Candidate ${field} is required and cannot be empty.`,
      });
    }
  }

  return errors;
};

/**
 * Validates job description data for email generation.
 *
 * @param data - The job description data to validate
 * @returns Array of validation errors, empty if valid
 *
 * @example
 * ```typescript
 * const errors = validateJobDescription({ title: 'Software Engineer', company: 'Acme Inc' });
 * if (errors.length > 0) {
 *   console.error('Job description validation failed:', errors);
 * }
 * ```
 */
export const validateJobDescription = (data: JobDescription | null | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data) {
    errors.push({
      field: 'jobDescription',
      message: 'Job description is required. Please enter job details.',
    });
    return errors;
  }

  for (const field of REQUIRED_JOB_FIELDS) {
    if (isEmptyOrWhitespace(data[field])) {
      errors.push({
        field: `jobDescription.${field}`,
        message: `Job ${field} is required and cannot be empty.`,
      });
    }
  }

  return errors;
};

/**
 * Validates the complete input data required for email generation.
 *
 * @param input - The email generation input containing candidate data and job description
 * @returns ValidationResult object with isValid flag and array of validation errors
 *
 * @example
 * ```typescript
 * const result = validateEmailGenerationInput({
 *   candidateData: { name: 'John Doe', email: 'john@example.com', skills: ['TypeScript'] },
 *   jobDescription: { title: 'Software Engineer', company: 'Acme Inc', requirements: ['TypeScript'] }
 * });
 *
 * if (!result.isValid) {
 *   console.error(formatValidationErrors(result.errors));
 * }
 * ```
 */
export const validateEmailGenerationInput = (input: EmailGenerationInput): ValidationResult => {
  const errors: ValidationError[] = [
    ...validateCandidateData(input.candidateData),
    ...validateJobDescription(input.jobDescription),
  ];

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Formats validation errors into a human-readable string.
 *
 * @param errors - Array of validation errors to format
 * @returns Formatted error message string, or empty string if no errors
 *
 * @example
 * ```typescript
 * const errors = [{ field: 'name', message: 'Name is required' }];
 * console.log(formatValidationErrors(errors)); // "Name is required"
 *
 * const multipleErrors = [
 *   { field: 'name', message: 'Name is required' },
 *   { field: 'email', message: 'Email is required' }
 * ];
 * console.log(formatValidationErrors(multipleErrors));
 * // "Missing required fields: Name is required; Email is required"
 * ```
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0].message;
  return 'Missing required fields: ' + errors.map((e) => e.message).join('; ');
}
