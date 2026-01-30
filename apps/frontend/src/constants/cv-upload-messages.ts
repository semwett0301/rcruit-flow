/**
 * CV Upload Error Messages
 *
 * User-friendly error messages for each CV upload failure scenario.
 * These messages provide clear titles, explanations, and actionable guidance
 * to help users resolve upload issues.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

/**
 * Error message structure for CV upload failures
 */
export interface CvUploadErrorMessage {
  /** Short, descriptive title for the error */
  title: string;
  /** Detailed explanation of what went wrong */
  message: string;
  /** Actionable guidance for the user to resolve the issue */
  action: string;
}

/**
 * Mapping of CV upload error codes to user-friendly error messages
 */
export const CV_UPLOAD_ERROR_MESSAGES: Record<CvUploadErrorCode, CvUploadErrorMessage> = {
  [CvUploadErrorCode.INVALID_FILE_TYPE]: {
    title: 'Unsupported File Format',
    message: 'The file you selected is not a supported format.',
    action: 'Please upload a PDF, DOC, or DOCX file.',
  },
  [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: {
    title: 'File Too Large',
    message: `The file you selected exceeds the maximum allowed size of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB.`,
    action: 'Please reduce the file size or try a different file.',
  },
  [CvUploadErrorCode.FILE_CORRUPTED]: {
    title: 'File Cannot Be Processed',
    message: 'The file appears to be corrupted or unreadable.',
    action: 'Please try uploading a different file or re-save your document and try again.',
  },
  [CvUploadErrorCode.NETWORK_TIMEOUT]: {
    title: 'Upload Timed Out',
    message: 'The upload took too long to complete.',
    action: 'Please check your internet connection and try again.',
  },
  [CvUploadErrorCode.SERVER_ERROR]: {
    title: 'Upload Failed',
    message: 'We encountered an issue processing your file.',
    action: 'Please try again in a few moments. If the problem persists, contact support.',
  },
  [CvUploadErrorCode.UNKNOWN_ERROR]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred during upload.',
    action: 'Please try again. If the problem continues, contact our support team for assistance.',
  },
};

/**
 * Support contact information for users who need additional help
 */
export const SUPPORT_CONTACT = {
  email: 'support@rcruit-flow.com',
  message: 'Need help? Contact us at',
} as const;

/**
 * Helper function to get the full error message for a given error code
 * @param errorCode - The CV upload error code
 * @returns The corresponding error message object
 */
export function getCvUploadErrorMessage(errorCode: CvUploadErrorCode): CvUploadErrorMessage {
  return CV_UPLOAD_ERROR_MESSAGES[errorCode] ?? CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.UNKNOWN_ERROR];
}
