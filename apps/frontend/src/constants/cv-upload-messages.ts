/**
 * User-friendly error messages for CV upload failure scenarios.
 *
 * This module provides localized, actionable error messages for each
 * CV upload error code, helping users understand what went wrong and
 * how to resolve the issue.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@repo/dto';

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
 * Formats a byte value to a human-readable megabyte string.
 *
 * @param bytes - The size in bytes to format
 * @returns A formatted string like "10MB"
 */
const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)}MB`;
};

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
    message: `Please upload your CV in one of the following formats: ${CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ').toUpperCase()}.`,
    action: 'Convert your file to PDF or Word format and try again.',
  },
  [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: {
    title: 'File Too Large',
    message: `Your file exceeds the maximum size of ${formatFileSize(CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE)}.`,
    action: 'Please reduce the file size by compressing images or removing unnecessary content, then try again.',
  },
  [CvUploadErrorCode.FILE_CORRUPTED]: {
    title: 'Unable to Read File',
    message: 'The file appears to be corrupted or unreadable.',
    action: 'Please check that your file opens correctly on your device, then try uploading again.',
  },
  [CvUploadErrorCode.SERVER_ERROR]: {
    title: 'Upload Failed',
    message: 'We encountered an issue processing your CV.',
    action: 'Please try again in a few moments. If the problem persists, contact our support team.',
  },
  [CvUploadErrorCode.NETWORK_TIMEOUT]: {
    title: 'Connection Timeout',
    message: 'The upload took too long to complete.',
    action: 'Please check your internet connection and try again.',
  },
  [CvUploadErrorCode.UNKNOWN_ERROR]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred during upload.',
    action: 'Please try again. If the problem continues, contact support for assistance.',
  },
};

/**
 * Retrieves the error message for a given CV upload error code.
 *
 * @param errorCode - The error code to get the message for
 * @returns The corresponding error message object, or the unknown error message as fallback
 */
export function getCvUploadErrorMessage(errorCode: CvUploadErrorCode): CvUploadErrorMessage {
  return CV_UPLOAD_ERROR_MESSAGES[errorCode] ?? CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.UNKNOWN_ERROR];
}
