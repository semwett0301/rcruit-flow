/**
 * CV Upload Error Message Mapping Utility
 *
 * This module provides user-friendly error message mappings for CV upload errors.
 * It transforms technical error codes into human-readable messages with helpful
 * suggestions for users to resolve the issues.
 */

import {
  CvUploadErrorCode,
  CvUploadErrorResponse,
  CV_UPLOAD_CONSTRAINTS,
} from '@repo/dto';

/**
 * Represents a user-friendly error message structure
 */
export interface UserFriendlyError {
  /** Short title describing the error */
  title: string;
  /** Detailed message explaining what went wrong */
  message: string;
  /** Actionable suggestion for the user to resolve the issue */
  suggestion: string;
  /** Whether to show contact support option to the user */
  showContactSupport: boolean;
}

/**
 * Maps a CV upload error response to a user-friendly error message.
 *
 * @param error - The CV upload error response from the API
 * @returns A user-friendly error object with title, message, suggestion, and support flag
 *
 * @example
 * ```ts
 * const error: CvUploadErrorResponse = {
 *   code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
 *   message: 'File too large'
 * };
 * const userError = mapCvUploadErrorToUserMessage(error);
 * // userError.title === 'File Too Large'
 * ```
 */
export function mapCvUploadErrorToUserMessage(
  error: CvUploadErrorResponse
): UserFriendlyError {
  switch (error.code) {
    case CvUploadErrorCode.INVALID_FILE_TYPE:
      return {
        title: 'Unsupported File Format',
        message: `The file you selected is not in a supported format.`,
        suggestion: `Please upload your CV as a PDF, DOC, or DOCX file (accepted formats: ${CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}).`,
        showContactSupport: false,
      };

    case CvUploadErrorCode.FILE_SIZE_EXCEEDED:
      return {
        title: 'File Too Large',
        message: `Your file exceeds the maximum allowed size of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB.`,
        suggestion:
          'Please reduce the file size by compressing images or removing unnecessary content, then try uploading again.',
        showContactSupport: false,
      };

    case CvUploadErrorCode.FILE_CORRUPTED:
      return {
        title: 'File Cannot Be Read',
        message: 'The file appears to be corrupted or damaged.',
        suggestion:
          'Please check that the file opens correctly on your device, or try exporting it again from the original application.',
        showContactSupport: false,
      };

    case CvUploadErrorCode.SERVER_ERROR:
      return {
        title: 'Upload Failed',
        message: 'We encountered a problem while processing your upload.',
        suggestion:
          'Please wait a moment and try again. If the problem persists, our support team is here to help.',
        showContactSupport: true,
      };

    case CvUploadErrorCode.NETWORK_TIMEOUT:
      return {
        title: 'Connection Timed Out',
        message: 'The upload took too long to complete.',
        suggestion:
          "Please check your internet connection and try again. If you're on a slow connection, try uploading a smaller file.",
        showContactSupport: false,
      };

    default:
      return {
        title: 'Something Went Wrong',
        message: 'An unexpected error occurred during the upload.',
        suggestion:
          'Please try again. If the problem continues, contact our support team for assistance.',
        showContactSupport: true,
      };
  }
}

/**
 * Creates a CV upload error response for network timeout errors.
 * Useful for mapping client-side network failures to the standard error format.
 *
 * @returns A CvUploadErrorResponse with NETWORK_TIMEOUT code
 */
export function mapNetworkErrorToUploadError(): CvUploadErrorResponse {
  return {
    code: CvUploadErrorCode.NETWORK_TIMEOUT,
    message: 'Network timeout',
  };
}

/**
 * Creates a CV upload error response for unknown/unexpected errors.
 * Useful for mapping unhandled exceptions to the standard error format.
 *
 * @returns A CvUploadErrorResponse with UNKNOWN_ERROR code
 */
export function mapUnknownErrorToUploadError(): CvUploadErrorResponse {
  return {
    code: CvUploadErrorCode.UNKNOWN_ERROR,
    message: 'Unknown error',
  };
}
