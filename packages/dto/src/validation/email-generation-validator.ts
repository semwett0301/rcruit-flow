/**
 * Email Generation Validation Module
 *
 * Provides shared validation logic for email generation inputs across the application.
 * Validates candidate data, job descriptions, and other required fields for email generation.
 */

import {
  EmailGenerationInput,
  ValidationResult,
  ValidationError,
  REQUIRED_FIELDS,
} from './email-generation-validation';

/**
 * Validates the input data required for email generation.
 *
 * @param input - The email generation input containing candidate data and job description
 * @returns ValidationResult object with isValid flag and array of validation errors
 *
 * @example
 * ```typescript
 * const result = validateEmailGenerationInput({
 *   candidateData: { name: 'John Doe', email: 'john@example.com' },
 *   jobDescription: 'Software Engineer position...'
 * });
 *
 * if (!result.isValid) {
 *   console.error(formatValidationErrors(result.errors));
 * }
 * ```
 */
export function validateEmailGenerationInput(input: EmailGenerationInput): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate candidate data presence
  if (!input.candidateData) {
    errors.push({
      field: REQUIRED_FIELDS.CANDIDATE_DATA,
      message: 'Candidate data is required for email generation',
    });
  } else {
    // Validate required candidate fields
    if (!input.candidateData.name || input.candidateData.name.trim() === '') {
      errors.push({
        field: REQUIRED_FIELDS.CANDIDATE_NAME,
        message: 'Candidate name is required',
      });
    }
    if (!input.candidateData.email || input.candidateData.email.trim() === '') {
      errors.push({
        field: REQUIRED_FIELDS.CANDIDATE_EMAIL,
        message: 'Candidate email is required',
      });
    }
  }

  // Validate job description
  if (!input.jobDescription || input.jobDescription.trim() === '') {
    errors.push({
      field: REQUIRED_FIELDS.JOB_DESCRIPTION,
      message: 'Job description is required for email generation',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

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
