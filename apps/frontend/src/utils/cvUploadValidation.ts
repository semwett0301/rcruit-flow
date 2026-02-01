/**
 * CV Upload Validation Utility
 *
 * Client-side validation for CV file uploads with specific error codes.
 * Validates file type, size, and basic integrity before upload.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

/**
 * Result of CV file validation
 */
export interface ValidationResult {
  /** Whether the file passed all validation checks */
  isValid: boolean;
  /** Error code if validation failed */
  errorCode?: CvUploadErrorCode;
}

/**
 * Validates a CV file before upload.
 *
 * Performs the following checks:
 * - File type (MIME type and extension)
 * - File size (max limit)
 * - File integrity (non-empty)
 *
 * @param file - The File object to validate
 * @returns ValidationResult with isValid flag and optional errorCode
 *
 * @example
 * ```ts
 * const result = validateCvFile(selectedFile);
 * if (!result.isValid) {
 *   showError(result.errorCode);
 * }
 * ```
 */
export function validateCvFile(file: File): ValidationResult {
  // Check file type by MIME type and extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType =
    CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.type) ||
    CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(fileExtension);

  if (!isValidType) {
    return { isValid: false, errorCode: CvUploadErrorCode.INVALID_FILE_TYPE };
  }

  // Check file size against maximum allowed
  if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
    return { isValid: false, errorCode: CvUploadErrorCode.FILE_SIZE_EXCEEDED };
  }

  // Check if file is empty (potential corruption indicator)
  if (file.size === 0) {
    return { isValid: false, errorCode: CvUploadErrorCode.FILE_CORRUPTED };
  }

  return { isValid: true };
}

/**
 * Maps HTTP error status codes to CV upload error codes.
 *
 * If a specific errorCode is provided in the response, it takes precedence.
 * Otherwise, maps common HTTP status codes to appropriate error codes.
 *
 * @param status - HTTP status code from the response
 * @param errorCode - Optional error code from the response body
 * @returns Appropriate CvUploadErrorCode for the error
 *
 * @example
 * ```ts
 * try {
 *   await uploadCv(file);
 * } catch (error) {
 *   const code = mapHttpErrorToCode(error.status, error.response?.errorCode);
 *   showError(code);
 * }
 * ```
 */
export function mapHttpErrorToCode(
  status: number,
  errorCode?: string
): CvUploadErrorCode {
  // If server provided a specific error code, use it if valid
  if (
    errorCode &&
    Object.values(CvUploadErrorCode).includes(errorCode as CvUploadErrorCode)
  ) {
    return errorCode as CvUploadErrorCode;
  }

  // Map HTTP status codes to error codes
  switch (status) {
    case 400:
      return CvUploadErrorCode.INVALID_FILE_TYPE;
    case 413:
      return CvUploadErrorCode.FILE_SIZE_EXCEEDED;
    case 422:
      return CvUploadErrorCode.FILE_CORRUPTED;
    case 408:
    case 504:
      return CvUploadErrorCode.NETWORK_TIMEOUT;
    case 500:
    case 502:
    case 503:
      return CvUploadErrorCode.SERVER_ERROR;
    default:
      return CvUploadErrorCode.UNKNOWN_ERROR;
  }
}
