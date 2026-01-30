/**
 * File upload constants for CV/resume uploads.
 * Shared between frontend and backend to ensure consistency in file validation.
 */

/**
 * Accepted CV file formats configuration.
 * Contains extensions, MIME types, and size limits for CV uploads.
 */
export const CV_ACCEPTED_FORMATS = {
  /** Allowed file extensions */
  extensions: ['.pdf', '.doc', '.docx'] as const,
  /** Corresponding MIME types for validation */
  mimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ] as const,
  /** Human-readable format list for display */
  displayText: 'PDF, DOC, DOCX',
  /** Maximum file size in bytes (5MB) */
  maxSizeBytes: 5 * 1024 * 1024,
  /** Human-readable max size for display */
  maxSizeDisplay: '5MB',
} as const;

/**
 * Validation messages for CV file uploads.
 * Provides consistent messaging across the application.
 */
export const CV_VALIDATION_MESSAGES = {
  /** Error message for invalid file format */
  invalidFormat: `Invalid file format. Accepted formats: ${CV_ACCEPTED_FORMATS.displayText}`,
  /** Error message when file exceeds size limit */
  fileTooLarge: `File size exceeds maximum allowed (${CV_ACCEPTED_FORMATS.maxSizeDisplay})`,
  /** Success message after upload */
  uploadSuccess: 'CV uploaded successfully',
  /** Message when CV upload is required but missing */
  uploadRequired: 'Please upload your CV',
} as const;

/** Type for accepted CV file extensions */
export type CvFileExtension = (typeof CV_ACCEPTED_FORMATS.extensions)[number];

/** Type for accepted CV MIME types */
export type CvMimeType = (typeof CV_ACCEPTED_FORMATS.mimeTypes)[number];
