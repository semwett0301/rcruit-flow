/**
 * Shared validation types and interfaces for email generation validation.
 * These types are used across the application to ensure consistent validation
 * of email generation inputs including candidate data and job descriptions.
 */

/**
 * Represents the data structure for a candidate.
 */
export interface CandidateData {
  /** The candidate's full name (required) */
  name: string;
  /** The candidate's email address (required) */
  email: string;
  /** The candidate's phone number */
  phone?: string;
  /** Optional list of skills the candidate possesses */
  skills?: string[];
  /** The candidate's experience summary */
  experience?: string;
  /** URL to the candidate's resume */
  resumeUrl?: string;
}

/**
 * Represents the data structure for a job description.
 */
export interface JobDescription {
  /** The job title (required) */
  title: string;
  /** The company name (required) */
  company: string;
  /** The full job description text (required) */
  description: string;
  /** Optional list of job requirements */
  requirements?: string[];
  /** Job location */
  location?: string;
}

/**
 * Input structure for email generation requests.
 */
export interface EmailGenerationInput {
  /** The candidate data */
  candidate: CandidateData;
  /** The job description data */
  jobDescription: JobDescription;
}

/**
 * Represents a single validation error.
 */
export interface ValidationError {
  /** The field path that failed validation (e.g., 'candidate.name') */
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
 * Required fields for candidate data validation.
 * These fields must be present and non-empty for valid candidate data.
 */
export const REQUIRED_CANDIDATE_FIELDS: (keyof CandidateData)[] = ['name', 'email'];

/**
 * Required fields for job description validation.
 * These fields must be present and non-empty for valid job description data.
 */
export const REQUIRED_JOB_FIELDS: (keyof JobDescription)[] = ['title', 'company', 'description'];

/**
 * Type representing the required candidate field names.
 */
export type RequiredCandidateField = (typeof REQUIRED_CANDIDATE_FIELDS)[number];

/**
 * Type representing the required job field names.
 */
export type RequiredJobField = (typeof REQUIRED_JOB_FIELDS)[number];
