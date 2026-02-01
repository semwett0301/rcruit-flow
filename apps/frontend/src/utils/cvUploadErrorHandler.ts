/**
 * CV Upload Error Handler Utility
 *
 * This module provides utility functions to parse backend errors from CV upload
 * operations and map them to user-friendly error messages.
 */

import { CvUploadErrorCode, CvUploadErrorResponse } from '@repo/dto';
import { AxiosError } from 'axios';

import {
  cvUploadErrorMessages,
  UserFriendlyError,
  SUPPORT_EMAIL,
} from '../constants/cvUploadErrors';

/**
 * Type guard to check if an error is an Axios error
 *
 * @param error - The error to check
 * @returns True if the error is an AxiosError
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError)?.isAxiosError === true;
}

/**
 * Parses a CV upload error and returns a user-friendly error message.
 *
 * This function handles various error scenarios:
 * - Backend errors with specific error codes
 * - Network timeout errors
 * - Network connectivity errors
 * - Unknown/unexpected errors
 *
 * @param error - The error to parse (can be any type)
 * @returns A UserFriendlyError object with title, message, and optional action
 *
 * @example
 * ```typescript
 * try {
 *   await uploadCv(file);
 * } catch (error) {
 *   const friendlyError = parseCvUploadError(error);
 *   showErrorToast(friendlyError.title, friendlyError.message);
 * }
 * ```
 */
export function parseCvUploadError(error: unknown): UserFriendlyError {
  // Handle Axios errors with backend response
  if (isAxiosError(error) && error.response?.data) {
    const errorData = error.response.data as CvUploadErrorResponse;

    if (errorData.code && cvUploadErrorMessages[errorData.code]) {
      return cvUploadErrorMessages[errorData.code];
    }
  }

  // Handle network timeout
  if (isAxiosError(error) && error.code === 'ECONNABORTED') {
    return cvUploadErrorMessages[CvUploadErrorCode.NETWORK_TIMEOUT];
  }

  // Handle network errors (no response received)
  if (isAxiosError(error) && !error.response) {
    return cvUploadErrorMessages[CvUploadErrorCode.NETWORK_TIMEOUT];
  }

  // Default to unknown error for any unhandled cases
  return cvUploadErrorMessages[CvUploadErrorCode.UNKNOWN_ERROR];
}

/**
 * Returns a formatted support contact message.
 *
 * @returns A string with the support email contact information
 *
 * @example
 * ```typescript
 * const supportMessage = getSupportContactMessage();
 * // Returns: "Need help? Contact us at support@example.com"
 * ```
 */
export function getSupportContactMessage(): string {
  return `Need help? Contact us at ${SUPPORT_EMAIL}`;
}
