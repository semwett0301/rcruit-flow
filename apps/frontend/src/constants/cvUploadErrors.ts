/**
 * CV Upload Error Messages
 *
 * This module provides user-friendly error messages for CV upload failure scenarios.
 * Each error code maps to a structured message with title, description, and actionable guidance.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

/**
 * Structure for user-friendly error display
 */
export interface UserFriendlyError {
  /** Short, descriptive title for the error */
  title: string;
  /** Detailed explanation of what went wrong */
  message: string;
  /** Actionable guidance for the user to resolve the issue */
  action: string;
}

/**
 * Mapping of CV upload error codes to user-friendly error messages.
 * These messages are designed to be displayed in the UI to help users
 * understand and resolve upload issues.
 */
export const CV_UPLOAD_ERROR_MESSAGES: Record<CvUploadErrorCode, UserFriendlyError> = {
  [CvUploadErrorCode.INVALID_FILE_TYPE]: {
    title: 'Unsupported File Format',
    message: `The file you selected is not a supported format. We accept ${CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ').toUpperCase()} files.`,
    action: 'Please select a PDF, DOC, or DOCX file and try again.',
  },
  [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: {
    title: 'File Too Large',
    message: `The file you selected exceeds our ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB size limit.`,
    action: 'Please reduce the file size or compress the document and try again.',
  },
  [CvUploadErrorCode.FILE_CORRUPTED]: {
    title: 'Unable to Read File',
    message: 'The file appears to be corrupted or unreadable.',
    action: 'Please check that the file opens correctly on your device, then try uploading again.',
  },
  [CvUploadErrorCode.SERVER_ERROR]: {
    title: 'Upload Failed',
    message: 'We encountered an issue processing your CV.',
    action: 'Please try again in a few moments. If the problem persists, contact our support team.',
  },
  [CvUploadErrorCode.NETWORK_TIMEOUT]: {
    title: 'Connection Timed Out',
    message: 'The upload took too long to complete.',
    action: 'Please check your internet connection and try again.',
  },
  [CvUploadErrorCode.UNKNOWN_ERROR]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred during the upload.',
    action: 'Please try again. If the problem continues, contact support for assistance.',
  },
};

/**
 * Retrieves the user-friendly error message for a given error code.
 * Falls back to UNKNOWN_ERROR if the code is not recognized.
 *
 * @param errorCode - The CV upload error code
 * @returns The corresponding user-friendly error object
 */
export function getCvUploadErrorMessage(errorCode: CvUploadErrorCode): UserFriendlyError {
  return CV_UPLOAD_ERROR_MESSAGES[errorCode] ?? CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.UNKNOWN_ERROR];
}
