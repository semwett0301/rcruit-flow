/**
 * CV Upload Validation Utility
 * 
 * Provides client-side validation for CV file uploads before sending to the server.
 * Uses shared constraints and error codes from the DTO package for consistency.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS, CvUploadErrorResponse } from '@rcruit-flow/dto';

/**
 * Validates a CV file against upload constraints.
 * 
 * Checks both file type (MIME type and extension) and file size.
 * Returns an error response if validation fails, or null if the file is valid.
 * 
 * @param file - The File object to validate
 * @returns CvUploadErrorResponse if validation fails, null if valid
 * 
 * @example
 * ```typescript
 * const error = validateCvFile(selectedFile);
 * if (error) {
 *   showError(error.message);
 *   return;
 * }
 * // Proceed with upload
 * ```
 */
export function validateCvFile(file: File): CvUploadErrorResponse | null {
  // Check file type
  if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        code: CvUploadErrorCode.INVALID_FILE_TYPE,
        message: 'Invalid file type',
        details: {
          allowedTypes: CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
          currentType: file.type || extension
        }
      };
    }
  }

  // Check file size
  if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
    return {
      code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
      message: 'File size exceeded',
      details: {
        maxSize: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB,
        currentSize: Math.round(file.size / (1024 * 1024) * 100) / 100
      }
    };
  }

  return null;
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
