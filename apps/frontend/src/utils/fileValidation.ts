/**
 * Client-side file validation utilities for CV uploads.
 * Provides validation functions and helpers for file input handling.
 */

import { CV_ACCEPTED_FORMATS, CV_VALIDATION_MESSAGES } from '@repo/dto';

/**
 * Result of a file validation operation.
 */
export interface FileValidationResult {
  /** Whether the file passed all validation checks */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
}

/**
 * Validates a CV file against accepted formats and size limits.
 *
 * @param file - The File object to validate
 * @returns FileValidationResult indicating if the file is valid and any error message
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
  // Check file type by extension and MIME type
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType =
    CV_ACCEPTED_FORMATS.extensions.includes(fileExtension) ||
    CV_ACCEPTED_FORMATS.mimeTypes.includes(file.type);

  if (!isValidType) {
    return {
      isValid: false,
      error: CV_VALIDATION_MESSAGES.invalidFormat,
    };
  }

  // Check file size against maximum allowed
  if (file.size > CV_ACCEPTED_FORMATS.maxSizeBytes) {
    return {
      isValid: false,
      error: CV_VALIDATION_MESSAGES.fileTooLarge,
    };
  }

  return { isValid: true };
};

/**
 * Generates the accept attribute value for file input elements.
 * Combines both file extensions and MIME types for maximum browser compatibility.
 *
 * @returns A comma-separated string of accepted file types
 *
 * @example
 * ```tsx
 * <input type="file" accept={getAcceptAttribute()} />
 * ```
 */
export const getAcceptAttribute = (): string => {
  return [...CV_ACCEPTED_FORMATS.extensions, ...CV_ACCEPTED_FORMATS.mimeTypes].join(',');
};

/**
 * Formats a file size in bytes to a human-readable string.
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets the maximum allowed file size in a human-readable format.
 *
 * @returns Formatted maximum file size string
 */
export const getMaxFileSizeFormatted = (): string => {
  return formatFileSize(CV_ACCEPTED_FORMATS.maxSizeBytes);
};
