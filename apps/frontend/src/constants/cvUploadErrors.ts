/**
 * CV Upload Error Messages
 *
 * This module provides user-friendly error messages for CV upload failure scenarios.
 * Each error code maps to a structured message with title, description, actionable suggestions,
 * and metadata about retry capability and support contact visibility.
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
  /** List of actionable suggestions for the user to resolve the issue */
  suggestions: string[];
  /** Whether to show contact support option */
  showContactSupport: boolean;
  /** Whether the user can retry the upload */
  canRetry: boolean;
}

/**
 * Support email address for user assistance
 */
export const SUPPORT_EMAIL = 'support@recruitflow.com';

/**
 * Mapping of CV upload error codes to user-friendly error messages.
 * These messages are designed to be displayed in the UI to help users
 * understand and resolve upload issues with actionable guidance.
 */
export const cvUploadErrorMessages: Record<CvUploadErrorCode, UserFriendlyError> = {
  [CvUploadErrorCode.INVALID_FILE_TYPE]: {
    title: 'Unsupported File Format',
    message: `We couldn't process your file because it's not in a supported format.`,
    suggestions: [
      `Please upload your CV as a PDF, DOC, or DOCX file`,
      `Accepted formats: ${CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`,
      'If your CV is in another format, try converting it to PDF first',
    ],
    showContactSupport: false,
    canRetry: false,
  },
  [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: {
    title: 'File Too Large',
    message: `Your file exceeds our ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB size limit.`,
    suggestions: [
      'Try compressing your PDF using an online tool',
      'Remove any large images or graphics from your CV',
      'Save your document with reduced image quality',
    ],
    showContactSupport: false,
    canRetry: false,
  },
  [CvUploadErrorCode.FILE_CORRUPTED]: {
    title: 'Unable to Read File',
    message: "We couldn't read your file. It may be damaged or corrupted.",
    suggestions: [
      'Try opening the file on your computer to verify it works',
      'Re-save the file and try uploading again',
      'Try exporting your CV to a different format (e.g., PDF)',
    ],
    showContactSupport: true,
    canRetry: false,
  },
  [CvUploadErrorCode.SERVER_ERROR]: {
    title: 'Upload Failed',
    message: 'We encountered a problem processing your upload.',
    suggestions: [
      'Please wait a moment and try again',
      'Check your internet connection',
      'If the problem persists, please contact our support team',
    ],
    showContactSupport: true,
    canRetry: true,
  },
  [CvUploadErrorCode.NETWORK_TIMEOUT]: {
    title: 'Connection Timed Out',
    message: 'The upload took too long to complete.',
    suggestions: [
      'Check your internet connection and try again',
      "If you're on a slow connection, try uploading a smaller file",
      'Move closer to your WiFi router or try a wired connection',
    ],
    showContactSupport: false,
    canRetry: true,
  },
  [CvUploadErrorCode.UNKNOWN_ERROR]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred while uploading your CV.',
    suggestions: [
      'Please try again in a few moments',
      'If the problem continues, try a different browser',
      'Contact our support team if you need assistance',
    ],
    showContactSupport: true,
    canRetry: true,
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
  return cvUploadErrorMessages[errorCode] ?? cvUploadErrorMessages[CvUploadErrorCode.UNKNOWN_ERROR];
}
