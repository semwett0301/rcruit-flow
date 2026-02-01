/**
 * Client-side validation utility for CV file uploads.
 * Provides validation functions and error mapping for CV upload operations.
 */

import {
  CvUploadErrorCode,
  CV_UPLOAD_CONSTRAINTS,
  CvUploadErrorResponse,
} from '@repo/dto';

/**
 * Validates a CV file against upload constraints.
 * Checks file type and file size before upload.
 *
 * @param file - The File object to validate
 * @returns CvUploadErrorResponse if validation fails, null if valid
 */
export const validateCvFile = (file: File): CvUploadErrorResponse | null => {
  // Check file type by MIME type first, then by extension as fallback
  if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        code: CvUploadErrorCode.INVALID_FILE_TYPE,
        message: 'Invalid file type',
        details: {
          allowedTypes: CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
          currentType: file.type || extension,
        },
      };
    }
  }

  // Check file size against maximum allowed
  if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
    return {
      code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
      message: 'File size exceeded',
      details: {
        maxSize: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE,
        currentSize: file.size,
      },
    };
  }

  return null;
};

/**
 * Maps API errors or network errors to appropriate CvUploadErrorCode.
 * Handles various error types including AbortError, network errors, and API responses.
 *
 * @param error - The error to map (can be Error, API response, or unknown)
 * @returns The corresponding CvUploadErrorCode
 */
export const mapApiErrorToCode = (error: unknown): CvUploadErrorCode => {
  // Handle standard Error objects
  if (error instanceof Error) {
    // Check for timeout/abort errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return CvUploadErrorCode.NETWORK_TIMEOUT;
    }
    // Check for network-related errors
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return CvUploadErrorCode.NETWORK_TIMEOUT;
    }
  }

  // Check for API error response with code property
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const apiError = error as { code: string };
    if (
      Object.values(CvUploadErrorCode).includes(
        apiError.code as CvUploadErrorCode
      )
    ) {
      return apiError.code as CvUploadErrorCode;
    }
  }

  // Default to unknown error for unhandled cases
  return CvUploadErrorCode.UNKNOWN_ERROR;
};
