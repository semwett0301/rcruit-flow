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
 * Validates an email address format using a standard regex pattern.
 *
 * @param email - The email address to validate
 * @returns true if the email format is valid, false otherwise
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates candidate data for email generation.
 *
 * @param candidate - The candidate data to validate (can be partial, null, or undefined)
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
export function validateCandidateData(
  candidate: Partial<CandidateData> | null | undefined
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!candidate) {
    errors.push({ field: 'candidate', message: 'Candidate data is required' });
    return errors;
  }

  for (const field of REQUIRED_CANDIDATE_FIELDS) {
    const value = candidate[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push({
        field: `candidate.${field}`,
        message: `Candidate ${field} is required`,
      });
    }
  }

  if (candidate.email && !isValidEmail(candidate.email)) {
    errors.push({
      field: 'candidate.email',
      message: 'Please enter a valid email address',
    });
  }

  return errors;
}

/**
 * Validates job description data for email generation.
 *
 * @param job - The job description data to validate (can be partial, null, or undefined)
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
export function validateJobDescription(
  job: Partial<JobDescription> | null | undefined
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!job) {
    errors.push({ field: 'jobDescription', message: 'Job description is required' });
    return errors;
  }

  for (const field of REQUIRED_JOB_FIELDS) {
    const value = job[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push({
        field: `jobDescription.${field}`,
        message: `Job ${field} is required`,
      });
    }
  }

  return errors;
}

/**
 * Validates the complete input data required for email generation.
 *
 * @param input - The email generation input containing candidate data and job description
 * @returns ValidationResult object with isValid flag and array of validation errors
 *
 * @example
 * ```typescript
 * const result = validateEmailGenerationInput({
 *   candidate: { name: 'John Doe', email: 'john@example.com', skills: ['TypeScript'] },
 *   jobDescription: { title: 'Software Engineer', company: 'Acme Inc', requirements: ['TypeScript'] }
 * });
 *
 * if (!result.isValid) {
 *   console.error(formatValidationErrors(result.errors));
 * }
 * ```
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
 * // "• Name is required\n• Email is required"
 * ```
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0].message;
  return errors.map((e) => `• ${e.message}`).join('\n');
}
