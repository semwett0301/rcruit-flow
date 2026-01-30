/**
 * File validation utilities for CV/resume uploads.
 * Provides validation functions and helpers for file input handling.
 */

import { CV_ACCEPTED_FORMATS, CV_VALIDATION_MESSAGES } from '@repo/dto';

/**
 * Result of file validation operation.
 */
export interface FileValidationResult {
  /** Whether the file passed all validation checks */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
}

/**
 * Validates a CV/resume file against accepted formats and size limits.
 *
 * @param file - The file to validate
 * @returns Validation result with isValid flag and optional error message
 *
 * @example
 * ```ts
 * const result = validateCVFile(selectedFile);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export const validateCVFile = (file: File): FileValidationResult => {
  if (!file) {
    return { isValid: false, error: CV_VALIDATION_MESSAGES.uploadRequired };
  }

  const isValidType = CV_ACCEPTED_FORMATS.mimeTypes.includes(file.type);
  if (!isValidType) {
    return { isValid: false, error: CV_VALIDATION_MESSAGES.invalidFormat };
  }

  if (file.size > CV_ACCEPTED_FORMATS.maxSizeBytes) {
    return { isValid: false, error: CV_VALIDATION_MESSAGES.fileTooLarge };
  }

  return { isValid: true };
};

/**
 * Generates the accept attribute value for file input elements.
 * Combines MIME types and file extensions for maximum browser compatibility.
 *
 * @returns Comma-separated string of accepted MIME types and extensions
 *
 * @example
 * ```tsx
 * <input type="file" accept={getAcceptAttribute()} />
 * ```
 */
export const getAcceptAttribute = (): string => {
  return [...CV_ACCEPTED_FORMATS.mimeTypes, ...CV_ACCEPTED_FORMATS.extensions].join(',');
};
