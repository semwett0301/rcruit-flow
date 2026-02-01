/**
 * Custom hook for CV file upload with comprehensive error handling.
 * Provides upload state management, retry functionality, and user-friendly error mapping.
 */
import { useState, useCallback } from 'react';
import { CvUploadErrorCode, CvUploadErrorResponse } from '@rcruit-flow/dto';
import { validateCvFile, mapApiErrorToCode } from '../utils/cv-upload-validator';

/**
 * Configuration options for the useCvUpload hook.
 */
interface UseCvUploadOptions {
  /** The API endpoint URL for CV upload */
  uploadEndpoint: string;
  /** Callback invoked on successful upload */
  onSuccess?: (response: unknown) => void;
  /** Request timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

/**
 * Return type for the useCvUpload hook.
 */
interface UseCvUploadReturn {
  /** Function to initiate file upload */
  upload: (file: File) => Promise<void>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Current error response, if any */
  error: CvUploadErrorResponse | null;
  /** Function to clear the current error */
  clearError: () => void;
  /** Reference ID for error tracking/support */
  errorReference: string | null;
}

/** Default upload timeout in milliseconds (30 seconds) */
const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Generates a unique error reference ID for tracking and support purposes.
 * @returns A unique reference string in format CV-{timestamp}
 */
function generateErrorReference(): string {
  return `CV-${Date.now()}`;
}

/**
 * Custom hook for handling CV file uploads with proper error handling.
 *
 * Features:
 * - Client-side file validation before upload
 * - Request timeout handling with AbortController
 * - Structured error responses with reference IDs
 * - Loading state management
 *
 * @param options - Configuration options for the upload
 * @returns Object containing upload function, state, and control methods
 *
 * @example
 * ```tsx
 * const { upload, isUploading, error, clearError, errorReference } = useCvUpload({
 *   uploadEndpoint: '/api/cv/upload',
 *   onSuccess: (data) => console.log('Uploaded:', data),
 *   timeoutMs: 60000, // 60 second timeout
 * });
 *
 * const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) upload(file);
 * };
 *
 * // Display error with reference
 * if (error) {
 *   console.error(`Error (${errorReference}):`, error.message);
 * }
 * ```
 */
export function useCvUpload({
  uploadEndpoint,
  onSuccess,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: UseCvUploadOptions): UseCvUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<CvUploadErrorResponse | null>(null);
  const [errorReference, setErrorReference] = useState<string | null>(null);

  /**
   * Clears the current error state and reference.
   */
  const clearError = useCallback(() => {
    setError(null);
    setErrorReference(null);
  }, []);

  /**
   * Uploads a CV file to the configured endpoint.
   *
   * Performs client-side validation before uploading and handles
   * various error scenarios including timeouts and server errors.
   *
   * @param file - The file to upload
   */
  const upload = useCallback(
    async (file: File) => {
      // Clear any previous errors
      clearError();

      // Perform client-side validation first
      const validationError = validateCvFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsUploading(true);

      // Set up abort controller for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const formData = new FormData();
        formData.append('cv', file);

        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Attempt to parse error response from server
          const errorData = await response.json().catch(() => ({}));
          const refId = generateErrorReference();
          setErrorReference(refId);
          setError({
            code: errorData.code || CvUploadErrorCode.SERVER_ERROR,
            message: errorData.message || 'Server error',
            details: errorData.details,
          });
          return;
        }

        const result = await response.json();
        onSuccess?.(result);
      } catch (err) {
        clearTimeout(timeoutId);

        // Generate reference ID for error tracking
        const refId = generateErrorReference();
        setErrorReference(refId);

        // Map the error to appropriate error code
        setError({
          code: mapApiErrorToCode(err),
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [uploadEndpoint, onSuccess, timeoutMs, clearError]
  );

  return {
    upload,
    isUploading,
    error,
    clearError,
    errorReference,
  };
}
