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
  suggestion: string;
}

/**
 * Mapping of CV upload error codes to user-friendly error messages.
 * Each error includes a title, descriptive message, and suggested action.
 */
export const CV_UPLOAD_ERROR_MESSAGES: Record<CvUploadErrorCode, UserFriendlyError> = {
  [CvUploadErrorCode.INVALID_FILE_TYPE]: {
    title: 'Invalid File Type',
    message: 'The file you selected is not a supported format.',
    suggestion: `Please upload a file in one of these formats: ${CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`
  },
  [CvUploadErrorCode.FILE_TOO_LARGE]: {
    title: 'File Too Large',
    message: `Your file exceeds the maximum size limit of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB.`,
    suggestion: 'Please reduce the file size by compressing images or removing unnecessary content, then try again.'
  },
  [CvUploadErrorCode.FILE_CORRUPTED]: {
    title: 'File Cannot Be Read',
    message: 'The file appears to be damaged or corrupted.',
    suggestion: 'Please check that the file opens correctly on your computer, or try exporting it again from the original application.'
  },
  [CvUploadErrorCode.PROCESSING_ERROR]: {
    title: 'Processing Failed',
    message: 'We encountered an issue while processing your CV.',
    suggestion: 'Please try saving your CV in a different format (PDF is recommended) and upload again.'
  },
  [CvUploadErrorCode.NETWORK_TIMEOUT]: {
    title: 'Upload Timed Out',
    message: 'The upload took too long to complete.',
    suggestion: 'Please check your internet connection and try again. If the problem persists, try uploading a smaller file.'
  },
  [CvUploadErrorCode.SERVER_ERROR]: {
    title: 'Upload Failed',
    message: 'Something went wrong on our end.',
    suggestion: 'Please try again in a few moments. If the problem continues, contact our support team for assistance.'
  },
  [CvUploadErrorCode.PARTIAL_UPLOAD]: {
    title: 'Upload Incomplete',
    message: 'Only part of your file was uploaded.',
    suggestion: 'Please check your internet connection and try uploading the file again.'
  },
  [CvUploadErrorCode.UNSUPPORTED_FORMAT]: {
    title: 'Format Not Supported',
    message: 'This file format is not supported.',
    suggestion: `Please convert your CV to one of these formats: ${CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')} and try again.`
  },
  [CvUploadErrorCode.EMPTY_FILE]: {
    title: 'Empty File',
    message: 'The file you selected appears to be empty.',
    suggestion: 'Please check that your CV has content and try uploading again.'
  },
  [CvUploadErrorCode.UNKNOWN_ERROR]: {
    title: 'Upload Failed',
    message: 'An unexpected error occurred during upload.',
    suggestion: 'Please try again. If the problem persists, contact our support team.'
  }
};

/**
 * Retrieves the user-friendly error message for a given error code.
 * Falls back to UNKNOWN_ERROR if the code is not recognized.
 *
 * @param code - The CV upload error code (can be enum value or string)
 * @returns The corresponding user-friendly error object
 */
export const getErrorMessage = (code: CvUploadErrorCode | string): UserFriendlyError => {
  return CV_UPLOAD_ERROR_MESSAGES[code as CvUploadErrorCode] || CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.UNKNOWN_ERROR];
};
