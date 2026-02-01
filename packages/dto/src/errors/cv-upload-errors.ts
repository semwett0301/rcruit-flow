/**
 * CV Upload Error Types and Codes
 *
 * Shared error definitions for CV upload functionality.
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
 * Additional details that may be included with upload errors.
 * Provides context about constraints and actual values for debugging.
 */
export interface CvUploadErrorDetails {
  /** Maximum allowed file size in bytes */
  maxSize?: number;
  /** List of allowed MIME types */
  allowedTypes?: string[];
  /** Actual size of the uploaded file in bytes */
  currentSize?: number;
  /** Actual MIME type of the uploaded file */
  currentType?: string;
}

/**
 * Standard error response structure for CV upload failures.
 * Used for API responses and error handling across the application.
 */
export interface CvUploadErrorResponse {
  /** The specific error code identifying the failure type */
  code: CvUploadErrorCode;
  /** Human-readable error message */
  message: string;
  /** Optional additional details about the error */
  details?: CvUploadErrorDetails;
}

/**
 * Constraints for CV file uploads.
 * These values should be used consistently across frontend validation
 * and backend processing.
 */
export const CV_UPLOAD_CONSTRAINTS = {
  /** Maximum file size in megabytes */
  MAX_FILE_SIZE_MB: 10,
  /** Maximum file size in bytes (10 MB) */
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  /** Allowed MIME types for CV uploads */
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  /** Allowed file extensions for CV uploads */
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
} as const;

/**
 * Type for the CV upload constraints object.
 * Useful for type-safe access to constraint values.
 */
export type CvUploadConstraints = typeof CV_UPLOAD_CONSTRAINTS;

/**
 * Default error messages for each error code.
 * Can be used as fallback messages when custom messages are not provided.
 */
export const CV_UPLOAD_ERROR_MESSAGES: Record<CvUploadErrorCode, string> = {
  [CvUploadErrorCode.INVALID_FILE_TYPE]:
    'Invalid file type. Please upload a PDF, DOC, or DOCX file.',
  [CvUploadErrorCode.FILE_SIZE_EXCEEDED]:
    `File size exceeds the maximum limit of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB.`,
  [CvUploadErrorCode.FILE_CORRUPTED]:
    'The file appears to be corrupted or cannot be read.',
  [CvUploadErrorCode.SERVER_ERROR]:
    'An error occurred while processing your upload. Please try again.',
  [CvUploadErrorCode.NETWORK_TIMEOUT]:
    'The upload timed out. Please check your connection and try again.',
  [CvUploadErrorCode.UNKNOWN_ERROR]:
    'An unexpected error occurred. Please try again.',
};

/**
 * Creates a standardized CV upload error response.
 *
 * @param code - The error code
 * @param message - Optional custom message (defaults to standard message for the code)
 * @param details - Optional additional error details
 * @returns A properly formatted CvUploadErrorResponse
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
 * Type guard to check if an error response is a CV upload error.
 *
 * @param error - The error object to check
 * @returns True if the error is a CvUploadErrorResponse
 */
export function isCvUploadError(
  error: unknown
): error is CvUploadErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    Object.values(CvUploadErrorCode).includes(
      (error as CvUploadErrorResponse).code
    )
  );
}

/**
 * Validates a file against CV upload constraints.
 *
 * @param fileSize - The file size in bytes
 * @param fileType - The MIME type of the file
 * @returns The error code if validation fails, or null if valid
 */
export function validateCvFile(
  fileSize: number,
  fileType: string
): CvUploadErrorCode | null {
  if (fileSize > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
    return CvUploadErrorCode.FILE_SIZE_EXCEEDED;
  }

  if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(fileType)) {
    return CvUploadErrorCode.INVALID_FILE_TYPE;
  }

  return null;
}
