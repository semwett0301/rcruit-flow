/**
 * Client-side validation utilities for CV file uploads.
 * 
 * Provides validation functions to check file type and size constraints
 * before uploading, and utilities to map HTTP errors to CV upload error codes.
 */

import {
  CvUploadErrorCode,
  CV_UPLOAD_CONSTRAINTS,
  CvUploadErrorResponse,
} from '@rcruit-flow/dto';

/**
 * Validates a CV file against upload constraints.
 * 
 * Checks both file type (MIME type and extension) and file size
 * against the defined constraints.
 * 
 * @param file - The File object to validate
 * @returns CvUploadErrorResponse if validation fails, null if valid
 * 
 * @example
 * ```ts
 * const error = validateCvFile(selectedFile);
 * if (error) {
 *   showError(error.message);
 *   return;
 * }
 * // Proceed with upload
 * ```
 */
export function validateCvFile(file: File): CvUploadErrorResponse | null {
  // Check file type by MIME type first
  if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    // Fallback to extension check for cases where MIME type is not reliable
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        code: CvUploadErrorCode.INVALID_FILE_TYPE,
        message: 'Invalid file type',
        details: {
          allowedTypes: CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
        },
      };
    }
  }

  // Check file size against maximum allowed
  if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
    return {
      code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
      message: 'File size exceeded',
      details: {
        maxSize: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB,
      },
    };
  }

  return null;
}

/**
 * Type definition for axios-like error responses.
 */
interface AxiosLikeError {
  response?: {
    status?: number;
    data?: {
      code?: CvUploadErrorCode;
    };
  };
}

/**
 * Maps HTTP errors to CV upload error codes.
 * 
 * Handles various error types including:
 * - Network errors and timeouts
 * - Axios/fetch response errors with status codes
 * - Server-provided error codes
 * 
 * @param error - The error object from the HTTP request
 * @returns The appropriate CvUploadErrorCode
 * 
 * @example
 * ```ts
 * try {
 *   await uploadCv(file);
 * } catch (error) {
 *   const errorCode = mapHttpErrorToCvUploadError(error);
 *   handleUploadError(errorCode);
 * }
 * ```
 */
export function mapHttpErrorToCvUploadError(error: unknown): CvUploadErrorCode {
  // Handle standard Error objects for network/timeout issues
  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return CvUploadErrorCode.UPLOAD_TIMEOUT;
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return CvUploadErrorCode.NETWORK_ERROR;
    }
  }

  // Check for axios/fetch response errors with typed structure
  const axiosError = error as AxiosLikeError;
  
  // Prefer server-provided error code if available
  if (axiosError?.response?.data?.code) {
    return axiosError.response.data.code;
  }

  // Map HTTP status codes to error codes
  if (axiosError?.response?.status) {
    const status = axiosError.response.status;
    
    if (status === 413) {
      return CvUploadErrorCode.FILE_SIZE_EXCEEDED;
    }
    if (status === 415) {
      return CvUploadErrorCode.INVALID_FILE_TYPE;
    }
    if (status === 422) {
      return CvUploadErrorCode.FILE_CORRUPTED;
    }
    if (status >= 500) {
      return CvUploadErrorCode.SERVER_ERROR;
    }
  }

  return CvUploadErrorCode.UNKNOWN_ERROR;
}
