/**
 * Shared validation types and interfaces for email generation validation.
 * These types are used across the application to ensure consistent validation
 * of email generation inputs including candidate data and job descriptions.
 */

/**
 * Represents the data structure for a candidate.
 */
export interface CandidateData {
  /** The candidate's full name */
  name: string;
  /** The candidate's email address */
  email: string;
  /** Optional list of skills the candidate possesses */
  skills?: string[];
  /** Optional description of the candidate's experience */
  experience?: string;
}

/**
 * Input structure for email generation requests.
 */
export interface EmailGenerationInput {
  /** The candidate data, or null if not provided */
  candidateData: CandidateData | null;
  /** The job description text, or null if not provided */
  jobDescription: string | null;
}

/**
 * Represents a single validation error.
 */
export interface ValidationError {
  /** The field path that failed validation (e.g., 'candidateData.name') */
  field: string;
  /** Human-readable error message describing the validation failure */
  message: string;
}

/**
 * Result of a validation operation.
 */
export interface ValidationResult {
  /** Whether the validation passed (true) or failed (false) */
  isValid: boolean;
  /** Array of validation errors, empty if isValid is true */
  errors: ValidationError[];
}

/**
 * Constants for required field identifiers used in validation.
 * These provide consistent field naming across validation logic.
 */
export const REQUIRED_FIELDS = {
  /** The candidate data object field */
  CANDIDATE_DATA: 'candidateData',
  /** The candidate's name field (nested path) */
  CANDIDATE_NAME: 'candidateData.name',
  /** The candidate's email field (nested path) */
  CANDIDATE_EMAIL: 'candidateData.email',
  /** The job description field */
  JOB_DESCRIPTION: 'jobDescription',
} as const;

/**
 * Type representing the keys of REQUIRED_FIELDS.
 */
export type RequiredFieldKey = keyof typeof REQUIRED_FIELDS;

/**
 * Type representing the values of REQUIRED_FIELDS.
 */
export type RequiredFieldValue = (typeof REQUIRED_FIELDS)[RequiredFieldKey];
