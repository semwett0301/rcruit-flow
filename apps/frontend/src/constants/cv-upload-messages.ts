/**
 * User-friendly error messages for CV upload failure scenarios.
 *
 * This module provides localized, actionable error messages for each
 * CV upload error code, helping users understand what went wrong and
 * how to resolve the issue.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

/**
 * Error message structure for CV upload failures.
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
 * Mapping of CV upload error codes to user-friendly error messages.
 *
 * Each error message includes:
 * - A clear title describing the error type
 * - A message explaining what happened
 * - An action the user can take to resolve the issue
 */
export const CV_UPLOAD_ERROR_MESSAGES: Record<CvUploadErrorCode, CvUploadErrorMessage> = {
  [CvUploadErrorCode.INVALID_FILE_TYPE]: {
    title: 'Unsupported File Format',
    message: 'The file you selected is not a supported format. Please upload a PDF, DOC, or DOCX file.',
    action: 'Select a file with one of the supported formats and try again.',
  },
  [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: {
    title: 'File Too Large',
    message: `The file you selected exceeds the maximum size of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB.`,
    action: 'Please reduce the file size or choose a smaller file and try again.',
  },
  [CvUploadErrorCode.FILE_CORRUPTED]: {
    title: 'File Cannot Be Read',
    message: 'The file appears to be corrupted or damaged and cannot be processed.',
    action: 'Please try uploading a different copy of your CV or save it in a different format.',
  },
  [CvUploadErrorCode.SERVER_ERROR]: {
    title: 'Upload Failed',
    message: 'We encountered an issue processing your CV. This is not your fault.',
    action: 'Please try again in a few moments. If the problem persists, contact our support team.',
  },
  [CvUploadErrorCode.NETWORK_ERROR]: {
    title: 'Connection Problem',
    message: 'Your CV could not be uploaded due to a network issue.',
    action: 'Please check your internet connection and try again.',
  },
  [CvUploadErrorCode.UPLOAD_TIMEOUT]: {
    title: 'Upload Timed Out',
    message: 'The upload took too long to complete.',
    action: 'Please check your internet connection and try uploading again. Consider using a smaller file if the issue persists.',
  },
  [CvUploadErrorCode.UNKNOWN_ERROR]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred while uploading your CV.',
    action: 'Please try again. If the problem continues, contact our support team for assistance.',
  },
};

/**
 * Retrieves the error message for a given CV upload error code.
 *
 * @param errorCode - The error code to get the message for
 * @returns The corresponding error message object
 */
export function getCvUploadErrorMessage(errorCode: CvUploadErrorCode): CvUploadErrorMessage {
  return CV_UPLOAD_ERROR_MESSAGES[errorCode] ?? CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.UNKNOWN_ERROR];
}
