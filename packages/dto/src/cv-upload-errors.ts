/**
 * CV Upload Error Types and Constants
 *
 * Shared error types and constraints for CV upload functionality.
 * Used by both frontend and backend to ensure consistent error handling.
 */

/**
 * Error codes for CV upload failures.
 * These codes are used to identify specific error conditions
 * and enable appropriate error handling on both client and server.
 */
export enum CvUploadErrorCode {
  /** The uploaded file type is not supported */
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  /** The uploaded file exceeds the maximum allowed size */
  FILE_SIZE_EXCEEDED = 'FILE_SIZE_EXCEEDED',
  /** The uploaded file is corrupted or cannot be read */
  FILE_CORRUPTED = 'FILE_CORRUPTED',
  /** An internal server error occurred during upload processing */
  SERVER_ERROR = 'SERVER_ERROR',
  /** The upload request timed out due to network issues */
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  /** An unknown or unexpected error occurred */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Additional details that can be included in error responses.
 * Provides context-specific information for different error types.
 */
export interface CvUploadErrorDetails {
  /** Maximum allowed file size in bytes (for FILE_SIZE_EXCEEDED errors) */
  maxSize?: number;
  /** List of allowed MIME types (for INVALID_FILE_TYPE errors) */
  allowedTypes?: string[];
  /** Whether the operation can be retried */
  retryable?: boolean;
}

/**
 * Standard error response structure for CV upload failures.
 * Provides consistent error information across the application.
 */
export interface CvUploadErrorResponse {
  /** The specific error code identifying the failure type */
  code: CvUploadErrorCode;
  /** Human-readable error message suitable for display */
  message: string;
  /** Optional additional details about the error */
  details?: CvUploadErrorDetails;
}

/**
 * Constraints and validation rules for CV uploads.
 * These values should be used consistently across frontend validation
 * and backend processing.
 */
export const CV_UPLOAD_CONSTRAINTS = {
  /** Maximum file size in megabytes */
  MAX_FILE_SIZE_MB: 10,
  /** Maximum file size in bytes (10 MB) */
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  /** MIME types accepted for CV uploads */
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  /** File extensions accepted for CV uploads */
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
} as const;

/**
 * Type for the CV upload constraints object.
 * Useful for type-safe access to constraint values.
 */
export type CvUploadConstraints = typeof CV_UPLOAD_CONSTRAINTS;

/**
 * Default error messages for each error code.
 * Can be used as fallback messages when specific messages are not provided.
 */
export const CV_UPLOAD_ERROR_MESSAGES: Record<CvUploadErrorCode, string> = {
  [CvUploadErrorCode.INVALID_FILE_TYPE]: `Invalid file type. Allowed types: ${CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}`,
  [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: `File size exceeds the maximum limit of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB`,
  [CvUploadErrorCode.FILE_CORRUPTED]:
    'The uploaded file appears to be corrupted or cannot be read',
  [CvUploadErrorCode.SERVER_ERROR]:
    'An internal server error occurred. Please try again later',
  [CvUploadErrorCode.NETWORK_TIMEOUT]:
    'The upload request timed out. Please check your connection and try again',
  [CvUploadErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again',
};

/**
 * Indicates whether a specific error type is retryable.
 * Useful for implementing retry logic on the client side.
 */
export const CV_UPLOAD_ERROR_RETRYABLE: Record<CvUploadErrorCode, boolean> = {
  [CvUploadErrorCode.INVALID_FILE_TYPE]: false,
  [CvUploadErrorCode.FILE_SIZE_EXCEEDED]: false,
  [CvUploadErrorCode.FILE_CORRUPTED]: false,
  [CvUploadErrorCode.SERVER_ERROR]: true,
  [CvUploadErrorCode.NETWORK_TIMEOUT]: true,
  [CvUploadErrorCode.UNKNOWN_ERROR]: true,
};

/**
 * Helper function to create a standardized CV upload error response.
 *
 * @param code - The error code identifying the failure type
 * @param message - Optional custom message (defaults to standard message for the code)
 * @param details - Optional additional error details
 * @returns A properly formatted CvUploadErrorResponse object
 */
export function createCvUploadError(
  code: CvUploadErrorCode,
  message?: string,
  details?: CvUploadErrorDetails
): CvUploadErrorResponse {
  return {
    code,
    message: message ?? CV_UPLOAD_ERROR_MESSAGES[code],
    ...(details && { details }),
  };
}

/**
 * Helper function to create an error response for invalid file type.
 *
 * @param message - Optional custom message
 * @returns A CvUploadErrorResponse for invalid file type
 */
export function createInvalidFileTypeError(message?: string): CvUploadErrorResponse {
  return createCvUploadError(CvUploadErrorCode.INVALID_FILE_TYPE, message, {
    allowedTypes: [...CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES],
    retryable: false,
  });
}

/**
 * Helper function to create an error response for file size exceeded.
 *
 * @param message - Optional custom message
 * @returns A CvUploadErrorResponse for file size exceeded
 */
export function createFileSizeExceededError(message?: string): CvUploadErrorResponse {
  return createCvUploadError(CvUploadErrorCode.FILE_SIZE_EXCEEDED, message, {
    maxSize: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
    retryable: false,
  });
}

/**
 * Type guard to check if an error response is a CV upload error.
 *
 * @param error - The error object to check
 * @returns True if the error is a CvUploadErrorResponse
 */
export function isCvUploadErrorResponse(error: unknown): error is CvUploadErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    Object.values(CvUploadErrorCode).includes((error as CvUploadErrorResponse).code)
  );
}
