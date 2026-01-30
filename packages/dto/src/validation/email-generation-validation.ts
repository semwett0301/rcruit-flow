/**
 * Email Generation Validation Types and Interfaces
 *
 * This module provides shared validation types, interfaces, and constants
 * for validating email generation input data including candidate information
 * and job descriptions.
 */

/**
 * Represents candidate data for email generation.
 */
export interface CandidateData {
  /** Full name of the candidate */
  name: string;
  /** Email address of the candidate */
  email: string;
  /** Optional phone number */
  phone?: string;
  /** Optional list of skills */
  skills?: string[];
  /** Optional experience description */
  experience?: string;
  /** Optional education background */
  education?: string;
}

/**
 * Represents job description data for email generation.
 */
export interface JobDescription {
  /** Job title */
  title: string;
  /** Company name */
  company: string;
  /** Full job description */
  description: string;
  /** Optional list of job requirements */
  requirements?: string[];
}

/**
 * Input data structure for email generation.
 */
export interface EmailGenerationInput {
  /** Candidate data, can be null if not provided */
  candidate: CandidateData | null;
  /** Job description data, can be null if not provided */
  jobDescription: JobDescription | null;
}

/**
 * Represents a single validation error.
 */
export interface ValidationError {
  /** The field that failed validation */
  field: string;
  /** Human-readable error message */
  message: string;
}

/**
 * Result of a validation operation.
 */
export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** List of validation errors (empty if valid) */
  errors: ValidationError[];
}

/**
 * Required fields for candidate data validation.
 * These fields must be present and non-empty for valid candidate data.
 */
export const REQUIRED_CANDIDATE_FIELDS = ['name', 'email'] as const;

/**
 * Required fields for job description validation.
 * These fields must be present and non-empty for valid job description data.
 */
export const REQUIRED_JOB_FIELDS = ['title', 'company', 'description'] as const;

/**
 * Type representing the required candidate field names.
 */
export type RequiredCandidateField = (typeof REQUIRED_CANDIDATE_FIELDS)[number];

/**
 * Type representing the required job field names.
 */
export type RequiredJobField = (typeof REQUIRED_JOB_FIELDS)[number];
