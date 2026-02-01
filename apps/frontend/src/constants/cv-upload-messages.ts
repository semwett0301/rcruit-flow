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
    message: 'The file you selected is not in a supported format. We accept PDF, DOC, and DOCX files.',
    action: 'Please save your CV in one of the supported formats and try uploading again.'
  },
  [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: {
    title: 'File Too Large',
    message: `Your file exceeds the maximum allowed size of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB.`,
    action: 'Please reduce the file size by compressing images or removing unnecessary content, then try again.'
  },
  [CvUploadErrorCode.FILE_CORRUPTED]: {
    title: 'Unable to Read File',
    message: "We couldn't read your file. It may be corrupted or damaged.",
    action: 'Please check that your file opens correctly on your device, or try exporting it again from your document editor.'
  },
  [CvUploadErrorCode.SERVER_ERROR]: {
    title: 'Upload Failed',
    message: 'We encountered an issue while processing your CV.',
    action: 'Please try again in a few moments. If the problem persists, contact our support team for assistance.'
  },
  [CvUploadErrorCode.NETWORK_TIMEOUT]: {
    title: 'Connection Timed Out',
    message: 'The upload took too long to complete. This might be due to a slow internet connection.',
    action: 'Please check your internet connection and try uploading again.'
  },
  [CvUploadErrorCode.UNKNOWN_ERROR]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred while uploading your CV.',
    action: 'Please try again. If the issue continues, contact our support team.'
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
