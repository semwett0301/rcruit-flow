/**
 * File upload constants for CV/resume uploads.
 * Shared between frontend and backend for consistent validation.
 */

/**
 * Accepted CV file formats configuration.
 * Contains MIME types, extensions, and size limits for CV uploads.
 */
export const CV_ACCEPTED_FORMATS = {
  /** Accepted MIME types for CV files */
  mimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  /** Accepted file extensions for CV files */
  extensions: ['.pdf', '.doc', '.docx'],
  /** Human-readable display text for accepted formats */
  displayText: 'PDF, DOC, or DOCX',
  /** Maximum file size in bytes (5MB) */
  maxSizeBytes: 5 * 1024 * 1024,
  /** Human-readable maximum file size */
  maxSizeDisplay: '5MB',
} as const;

/**
 * Validation messages for CV file uploads.
 * Provides consistent messaging across frontend and backend.
 */
export const CV_VALIDATION_MESSAGES = {
  /** Error message for invalid file format */
  invalidFormat: `Please upload a valid CV file. Accepted formats: ${CV_ACCEPTED_FORMATS.displayText}`,
  /** Error message for file exceeding size limit */
  fileTooLarge: `File size must be less than ${CV_ACCEPTED_FORMATS.maxSizeDisplay}`,
  /** Success message for successful upload */
  uploadSuccess: 'CV uploaded successfully',
  /** Error message when CV upload is required but missing */
  uploadRequired: 'Please upload your CV',
} as const;

/** Type for CV accepted formats configuration */
export type CvAcceptedFormats = typeof CV_ACCEPTED_FORMATS;

/** Type for CV validation messages */
export type CvValidationMessages = typeof CV_VALIDATION_MESSAGES;
