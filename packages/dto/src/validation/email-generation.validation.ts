/**
 * Email Generation Validation Types and Interfaces
 *
 * This module provides shared validation types, interfaces, and constants
 * for email generation validation across the application.
 */

/**
 * Represents candidate data for email generation
 */
export interface CandidateData {
  /** Candidate's full name */
  name: string;
  /** Candidate's email address */
  email: string;
  /** Optional list of candidate skills */
  skills?: string[];
  /** Optional experience description */
  experience?: string;
  /** Optional full resume text */
  resumeText?: string;
}

/**
 * Represents job description data for email generation
 */
export interface JobDescription {
  /** Job title */
  title: string;
  /** Full job description */
  description: string;
  /** Optional list of job requirements */
  requirements?: string[];
  /** Optional company name */
  company?: string;
}

/**
 * Input data structure for email generation
 */
export interface EmailGenerationInput {
  /** Candidate information */
  candidate: CandidateData;
  /** Job description information */
  jobDescription: JobDescription;
}

/**
 * Represents a single validation error
 */
export interface ValidationError {
  /** Field name that failed validation */
  field: string;
  /** Human-readable error message */
  message: string;
}

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** List of validation errors (empty if valid) */
  errors: ValidationError[];
}

/**
 * Required fields for candidate data validation
 */
export const REQUIRED_CANDIDATE_FIELDS = ['name', 'email'] as const;

/**
 * Required fields for job description validation
 */
export const REQUIRED_JOB_FIELDS = ['title', 'description'] as const;

/**
 * Type representing required candidate field names
 */
export type RequiredCandidateField = (typeof REQUIRED_CANDIDATE_FIELDS)[number];

/**
 * Type representing required job field names
 */
export type RequiredJobField = (typeof REQUIRED_JOB_FIELDS)[number];
