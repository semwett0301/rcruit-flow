/**
 * CV Upload Validation Utility
 *
 * Provides client-side validation for CV file uploads before sending to the server.
 * Uses shared constraints and error codes from the DTO package for consistency.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@recruit-flow/dto';

/**
 * Result of CV file validation
 */
export interface ValidationResult {
  isValid: boolean;
  errorCode?: CvUploadErrorCode;
}

/**
 * Validates a CV file against upload constraints.
 *
 * Checks file type (MIME type and extension), file size, and for empty files.
 * Returns a ValidationResult indicating whether the file is valid.
 *
 * @param file - The File object to validate
 * @returns ValidationResult with isValid flag and optional errorCode
 *
 * @example
 * ```typescript
 * const result = validateCvFile(selectedFile);
 * if (!result.isValid) {
 *   showError(result.errorCode);
 *   return;
 * }
 * // Proceed with upload
 * ```
 */
export function validateCvFile(file: File): ValidationResult {
  // Check file type by MIME type first
  const isValidMimeType = CV_UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.type);

  // If MIME type is not valid, check by file extension as fallback
  if (!isValidMimeType) {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(fileExtension);

    if (!isValidExtension) {
      return { isValid: false, errorCode: CvUploadErrorCode.INVALID_FILE_TYPE };
    }
  }

  // Check file size
  if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
    return { isValid: false, errorCode: CvUploadErrorCode.FILE_SIZE_EXCEEDED };
  }

  // Check for empty file (potential corruption indicator)
  if (file.size === 0) {
    return { isValid: false, errorCode: CvUploadErrorCode.CORRUPTED_FILE };
  }

  return { isValid: true };
}

/**
 * Maps an API error or exception to a CvUploadErrorCode.
 *
 * Handles various error types including:
 * - Network errors (timeout, fetch failures)
 * - API responses with error codes
 * - Unknown errors
 *
 * @param error - The error to map (can be Error, API response, or unknown)
 * @returns The corresponding CvUploadErrorCode
 *
 * @example
 * ```typescript
 * try {
 *   await uploadCv(file);
 * } catch (error) {
 *   const errorCode = mapApiErrorToCode(error);
 *   handleUploadError(errorCode);
 * }
 * ```
 */
export function mapApiErrorToCode(error: unknown): CvUploadErrorCode {
  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return CvUploadErrorCode.NETWORK_TIMEOUT;
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return CvUploadErrorCode.NETWORK_TIMEOUT;
    }
  }

  // Check if it's an API response with error code
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    if (Object.values(CvUploadErrorCode).includes(code as CvUploadErrorCode)) {
      return code as CvUploadErrorCode;
    }
  }

  return CvUploadErrorCode.UNKNOWN_ERROR;
}
