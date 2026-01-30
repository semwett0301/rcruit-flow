/**
 * CV Upload Error Handler Utilities
 *
 * This module provides utility functions for handling CV upload errors,
 * including client-side file validation and API error mapping.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS, CvUploadErrorResponse } from '@rcruit-flow/dto';
import { CV_UPLOAD_ERROR_MESSAGES } from '../constants/cv-upload-messages';

/**
 * Validates a file before upload to catch common issues client-side.
 *
 * @param file - The File object to validate
 * @returns CvUploadErrorResponse if validation fails, null if file is valid
 *
 * @example
 * ```ts
 * const error = validateFileBeforeUpload(selectedFile);
 * if (error) {
 *   showError(error.message);
 *   return;
 * }
 * // Proceed with upload
 * ```
 */
export function validateFileBeforeUpload(file: File): CvUploadErrorResponse | null {
  // Check file type by extension and MIME type
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidExtension = CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(fileExtension);
  const isValidMimeType = CV_UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.type);

  if (!isValidExtension && !isValidMimeType) {
    return {
      code: CvUploadErrorCode.INVALID_FILE_TYPE,
      message: CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.INVALID_FILE_TYPE].message,
    };
  }

  // Check file size against maximum allowed
  if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
    return {
      code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
      message: CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.FILE_SIZE_EXCEEDED].message,
    };
  }

  return null;
}

/**
 * Shape of API error objects (axios/fetch style)
 */
interface ApiError {
  response?: {
    data?: CvUploadErrorResponse;
    status?: number;
  };
  code?: string;
  message?: string;
}

/**
 * Type guard to check if an error is an API error object
 */
function isApiError(error: unknown): error is ApiError {
  return error !== null && typeof error === 'object';
}

/**
 * Maps API errors to standardized CvUploadErrorResponse objects.
 *
 * Handles various error scenarios:
 * - Structured server errors with error codes
 * - Network timeouts
 * - Server errors (5xx status codes)
 * - Unknown/unexpected errors
 *
 * @param error - The error object from an API call
 * @returns A standardized CvUploadErrorResponse
 *
 * @example
 * ```ts
 * try {
 *   await uploadCv(file);
 * } catch (error) {
 *   const uploadError = mapApiErrorToUploadError(error);
 *   showError(uploadError.message);
 * }
 * ```
 */
export function mapApiErrorToUploadError(error: unknown): CvUploadErrorResponse {
  if (isApiError(error)) {
    // Server returned a structured error response
    if (error.response?.data?.code) {
      return error.response.data;
    }

    // Network timeout detection
    const isTimeout =
      error.code === 'ECONNABORTED' || error.message?.includes('timeout');
    if (isTimeout) {
      return {
        code: CvUploadErrorCode.NETWORK_TIMEOUT,
        message: CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.NETWORK_TIMEOUT].message,
      };
    }

    // Server error (5xx status codes)
    if (error.response?.status && error.response.status >= 500) {
      return {
        code: CvUploadErrorCode.SERVER_ERROR,
        message: CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.SERVER_ERROR].message,
      };
    }
  }

  // Fallback for unknown errors
  return {
    code: CvUploadErrorCode.UNKNOWN_ERROR,
    message: CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.UNKNOWN_ERROR].message,
  };
}

/**
 * Creates a CvUploadErrorResponse from an error code.
 *
 * @param code - The error code to create a response for
 * @returns A CvUploadErrorResponse with the appropriate message
 */
export function createErrorResponse(code: CvUploadErrorCode): CvUploadErrorResponse {
  return {
    code,
    message: CV_UPLOAD_ERROR_MESSAGES[code]?.message ?? 'An unexpected error occurred',
  };
}

/**
 * Checks if an error response indicates a retryable error.
 *
 * @param error - The error response to check
 * @returns true if the error is potentially retryable
 */
export function isRetryableError(error: CvUploadErrorResponse): boolean {
  const retryableCodes: CvUploadErrorCode[] = [
    CvUploadErrorCode.NETWORK_TIMEOUT,
    CvUploadErrorCode.SERVER_ERROR,
  ];

  return retryableCodes.includes(error.code);
}
