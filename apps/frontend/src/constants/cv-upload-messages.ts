/**
 * User-friendly error messages for CV upload failure scenarios.
 * Maps error codes from the DTO package to human-readable messages
 * with actionable guidance for users.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

/**
 * Structure for user-friendly error display.
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
 * Each error includes a title, descriptive message, and suggested action.
 */
export const CV_UPLOAD_ERROR_MESSAGES: Record<CvUploadErrorCode, UserFriendlyError> = {
  [CvUploadErrorCode.INVALID_FILE_TYPE]: {
    title: 'Unsupported File Format',
    message: `The file you selected is not supported. Please upload a file in one of these formats: ${CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ').toUpperCase()}.`,
    action: 'Select a PDF, DOC, or DOCX file and try again.'
  },
  [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: {
    title: 'File Too Large',
    message: `The file you selected exceeds the maximum allowed size of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB.`,
    action: 'Please reduce the file size or choose a smaller file and try again.'
  },
  [CvUploadErrorCode.CORRUPTED_FILE]: {
    title: 'File Cannot Be Read',
    message: 'The file appears to be corrupted or damaged and cannot be processed.',
    action: 'Please try uploading a different copy of your CV or save it in a different format.'
  },
  [CvUploadErrorCode.SERVER_ERROR]: {
    title: 'Upload Failed',
    message: 'We encountered an issue while processing your CV. This is not your fault.',
    action: 'Please try again in a few moments. If the problem persists, contact our support team.'
  },
  [CvUploadErrorCode.NETWORK_ERROR]: {
    title: 'Connection Problem',
    message: 'Your CV could not be uploaded due to a network issue.',
    action: 'Please check your internet connection and try again.'
  },
  [CvUploadErrorCode.PARSING_ERROR]: {
    title: 'Unable to Process CV',
    message: 'We were unable to extract information from your CV.',
    action: 'Please ensure your CV is not password-protected and try again, or upload a different format.'
  },
  [CvUploadErrorCode.UNKNOWN_ERROR]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred while uploading your CV.',
    action: 'Please try again. If the problem continues, contact support for assistance.'
  }
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
