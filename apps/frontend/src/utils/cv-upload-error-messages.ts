/**
 * CV Upload Error Messages Utility
 *
 * Maps error codes to user-friendly messages with actionable guidance
 * for CV upload operations.
 */

import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

/**
 * Represents a user-friendly error with title, message, and actionable guidance.
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
 * Maps a CV upload error code to a user-friendly error message.
 *
 * @param errorCode - The error code from the CV upload operation
 * @returns A UserFriendlyError object with title, message, and action
 *
 * @example
 * ```typescript
 * const error = getCvUploadErrorMessage(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
 * console.log(error.title); // "File Too Large"
 * ```
 */
export function getCvUploadErrorMessage(errorCode: CvUploadErrorCode): UserFriendlyError {
  const messages: Record<CvUploadErrorCode, UserFriendlyError> = {
    [CvUploadErrorCode.INVALID_FILE_TYPE]: {
      title: 'Unsupported File Format',
      message: `The file you selected is not a supported format. We accept ${CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')} files.`,
      action: 'Please select a PDF, DOC, or DOCX file and try again.',
    },
    [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: {
      title: 'File Too Large',
      message: `Your file exceeds the maximum size of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB.`,
      action: 'Please reduce the file size or compress the document and try again.',
    },
    [CvUploadErrorCode.FILE_CORRUPTED]: {
      title: 'Unable to Read File',
      message: 'The file appears to be corrupted or unreadable.',
      action: 'Please check that the file opens correctly on your device, then try uploading again.',
    },
    [CvUploadErrorCode.SERVER_ERROR]: {
      title: 'Upload Failed',
      message: 'We encountered an issue processing your file.',
      action: 'Please try again in a few moments. If the problem persists, contact support.',
    },
    [CvUploadErrorCode.NETWORK_TIMEOUT]: {
      title: 'Connection Timeout',
      message: 'The upload took too long to complete.',
      action: 'Please check your internet connection and try again.',
    },
    [CvUploadErrorCode.UNKNOWN_ERROR]: {
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred during upload.',
      action: 'Please try again. If the problem continues, contact our support team.',
    },
  };

  return messages[errorCode] || messages[CvUploadErrorCode.UNKNOWN_ERROR];
}
