/**
 * CV Upload Error Handler Utility
 *
 * Maps API errors and network errors to appropriate error codes
 * and formats them for user-friendly display.
 */

import { CvUploadErrorCode, CvUploadErrorResponse } from '@recruit-flow/dto';
import { CV_UPLOAD_ERROR_MESSAGES } from '../constants/cv-upload-messages';

/**
 * Formatted error object for display in the UI
 */
export interface FormattedCvError {
  code: CvUploadErrorCode;
  title: string;
  message: string;
  action: string;
}

/**
 * Maps API errors and network errors to appropriate error codes
 * and returns a formatted error object suitable for display to the user.
 *
 * Handles the following error types:
 * - Network errors (fetch failures, timeouts, connection refused)
 * - Abort errors (request cancellation)
 * - Structured API errors with CvUploadErrorCode
 * - HTTP status codes (500+, 413, 415)
 *
 * @param error - The error to handle (can be any type)
 * @returns FormattedCvError with code, title, message, and action
 */
export function mapApiErrorToCvUploadError(error: unknown): FormattedCvError {
  // Handle network errors (fetch failures)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return getFormattedError(CvUploadErrorCode.NETWORK_ERROR);
  }

  // Handle timeout/abort errors
  if (error instanceof Error && error.name === 'AbortError') {
    return getFormattedError(CvUploadErrorCode.NETWORK_ERROR);
  }

  // Handle axios/fetch errors with response
  if (typeof error === 'object' && error !== null) {
    const err = error as {
      response?: { data?: CvUploadErrorResponse; status?: number };
      code?: string;
      message?: string;
    };

    // Network timeout or connection refused (axios error codes)
    if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') {
      return getFormattedError(CvUploadErrorCode.NETWORK_ERROR);
    }

    // Server returned structured error with valid error code
    if (
      err.response?.data?.code &&
      Object.values(CvUploadErrorCode).includes(err.response.data.code)
    ) {
      return getFormattedError(err.response.data.code);
    }

    // Handle HTTP status codes when no structured error is available
    if (err.response?.status) {
      if (err.response.status >= 500) {
        return getFormattedError(CvUploadErrorCode.SERVER_ERROR);
      }
      if (err.response.status === 413) {
        return getFormattedError(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
      }
      if (err.response.status === 415) {
        return getFormattedError(CvUploadErrorCode.INVALID_FILE_TYPE);
      }
    }
  }

  // Default to unknown error for unhandled cases
  return getFormattedError(CvUploadErrorCode.UNKNOWN_ERROR);
}

/**
 * Formats an error code into a complete FormattedCvError object
 * by looking up the error information from the constants.
 *
 * @param code - The CvUploadErrorCode to format
 * @returns FormattedCvError with all display properties
 */
export function getFormattedError(code: CvUploadErrorCode): FormattedCvError {
  const errorInfo = CV_UPLOAD_ERROR_MESSAGES[code];
  return {
    code,
    ...errorInfo,
  };
}
