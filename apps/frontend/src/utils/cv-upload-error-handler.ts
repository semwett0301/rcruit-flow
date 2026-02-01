/**
 * CV Upload Error Handler Utility
 *
 * Maps API errors and network errors to appropriate error codes
 * and formats them for user-friendly display.
 */

import { CvUploadErrorCode, CvUploadErrorResponse } from '@rcruit-flow/dto';
import { CV_UPLOAD_ERROR_MESSAGES } from '../constants/cv-upload-messages';

/**
 * Formatted error object for display in the UI
 */
export interface FormattedUploadError {
  code: CvUploadErrorCode;
  title: string;
  message: string;
  action: string;
}

/**
 * Handles CV upload errors and returns a formatted error object
 * suitable for display to the user.
 *
 * @param error - The error to handle (can be any type)
 * @returns FormattedUploadError with code, title, message, and action
 */
export function handleCvUploadError(error: unknown): FormattedUploadError {
  // Handle network errors (fetch failures)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return formatError(CvUploadErrorCode.NETWORK_ERROR);
  }

  // Handle timeout/abort errors
  if (error instanceof Error && error.name === 'AbortError') {
    return formatError(CvUploadErrorCode.NETWORK_ERROR);
  }

  // Handle API error responses (structured error from backend)
  if (isApiErrorResponse(error)) {
    const errorCode = mapApiErrorCode(error.code);
    return formatError(errorCode);
  }

  // Handle axios/fetch response errors with HTTP status codes
  if (hasResponseStatus(error)) {
    if (error.response.status >= 500) {
      return formatError(CvUploadErrorCode.SERVER_ERROR);
    }
    if (error.response.status === 413) {
      return formatError(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
    }
    if (error.response.status === 415) {
      return formatError(CvUploadErrorCode.INVALID_FILE_TYPE);
    }
  }

  // Default to unknown error for unhandled cases
  return formatError(CvUploadErrorCode.UNKNOWN_ERROR);
}

/**
 * Formats an error code into a complete FormattedUploadError object
 *
 * @param code - The CvUploadErrorCode to format
 * @returns FormattedUploadError with all display properties
 */
function formatError(code: CvUploadErrorCode): FormattedUploadError {
  const errorInfo = CV_UPLOAD_ERROR_MESSAGES[code];
  return { code, ...errorInfo };
}

/**
 * Type guard to check if an error is a CvUploadErrorResponse from the API
 *
 * @param error - The error to check
 * @returns True if the error matches the CvUploadErrorResponse structure
 */
function isApiErrorResponse(error: unknown): error is CvUploadErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Type guard to check if an error has a response with a status code
 * (common pattern for axios and similar HTTP clients)
 *
 * @param error - The error to check
 * @returns True if the error has a response.status property
 */
function hasResponseStatus(
  error: unknown
): error is { response: { status: number } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { status?: unknown } }).response?.status ===
      'number'
  );
}

/**
 * Maps an API error code string to a valid CvUploadErrorCode enum value
 *
 * @param code - The error code string from the API
 * @returns The corresponding CvUploadErrorCode, or UNKNOWN_ERROR if not recognized
 */
function mapApiErrorCode(code: string): CvUploadErrorCode {
  if (Object.values(CvUploadErrorCode).includes(code as CvUploadErrorCode)) {
    return code as CvUploadErrorCode;
  }
  return CvUploadErrorCode.UNKNOWN_ERROR;
}
