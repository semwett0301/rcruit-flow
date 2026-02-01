/**
 * Custom hook for CV file upload with comprehensive error handling.
 * Provides client-side validation, upload state management, and proper error codes.
 */
import { useState, useCallback } from 'react';
import { CvUploadErrorCode, CvUploadErrorResponse } from '@rcruit-flow/dto';
import { validateCvFile } from '../utils/cv-upload-validator';

/**
 * Options for configuring the CV upload hook.
 */
interface UseCvUploadOptions {
  /** The endpoint URL for CV upload */
  uploadEndpoint: string;
  /** Callback invoked on successful upload */
  onSuccess?: (response: unknown) => void;
  /** Callback invoked when an error occurs */
  onError?: (errorCode: CvUploadErrorCode) => void;
}

/**
 * Return type for the useCvUpload hook.
 */
interface UseCvUploadReturn {
  /** Function to upload a CV file */
  upload: (file: File) => Promise<void>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Current error code, if any */
  error: CvUploadErrorCode | null;
  /** Function to clear the current error */
  clearError: () => void;
  /** Function to reset all state */
  reset: () => void;
}

/** Upload timeout in milliseconds (60 seconds) */
const UPLOAD_TIMEOUT_MS = 60000;

/**
 * Custom hook for handling CV file uploads with validation and error handling.
 *
 * Features:
 * - Client-side file validation (size, type, empty file checks)
 * - Upload state management (loading, error states)
 * - Proper error codes from @rcruit-flow/dto
 * - Configurable callbacks for success and error handling
 * - Network timeout handling (60 second timeout)
 * - Reset functionality for clearing all state
 *
 * @param options - Configuration options for the upload hook
 * @returns Object containing upload state and utility functions
 *
 * @example
 * ```tsx
 * const { upload, isUploading, error, clearError, reset } = useCvUpload({
 *   uploadEndpoint: '/api/cv/upload',
 *   onSuccess: (response) => console.log('Upload successful:', response),
 *   onError: (errorCode) => console.error('Upload failed:', errorCode),
 * });
 *
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     await upload(file);
 *   }
 * };
 *
 * // Display error to user
 * {error && (
 *   <div>
 *     <p>Error: {error}</p>
 *     <button onClick={clearError}>Dismiss</button>
 *   </div>
 * )}
 * ```
 */
export function useCvUpload({
  uploadEndpoint,
  onSuccess,
  onError,
}: UseCvUploadOptions): UseCvUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<CvUploadErrorCode | null>(null);

  /**
   * Clears the current error state.
   */
  const clearError = useCallback(() => setError(null), []);

  /**
   * Resets all upload state (loading and error).
   */
  const reset = useCallback(() => {
    setIsUploading(false);
    setError(null);
  }, []);

  /**
   * Uploads a CV file to the server.
   * Performs client-side validation before uploading.
   *
   * @param file - The CV file to upload
   */
  const upload = useCallback(
    async (file: File): Promise<void> => {
      // Clear any previous error
      clearError();

      // Perform client-side validation
      const validation = validateCvFile(file);
      if (!validation.valid && validation.errorCode) {
        setError(validation.errorCode);
        onError?.(validation.errorCode);
        return;
      }

      setIsUploading(true);

      // Prepare form data for upload
      const formData = new FormData();
      formData.append('cv', file);

      try {
        // Set up abort controller for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle non-OK responses
        if (!response.ok) {
          const errorData: CvUploadErrorResponse = await response.json().catch(() => ({
            code: CvUploadErrorCode.SERVER_ERROR,
          }));
          const errorCode = errorData.code || CvUploadErrorCode.SERVER_ERROR;
          setError(errorCode);
          onError?.(errorCode);
          return;
        }

        // Parse successful response
        const data = await response.json();
        onSuccess?.(data);
      } catch (err) {
        // Determine appropriate error code based on error type
        let errorCode = CvUploadErrorCode.UNKNOWN_ERROR;

        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            // Request was aborted due to timeout
            errorCode = CvUploadErrorCode.NETWORK_TIMEOUT;
          } else if (err.message.includes('network') || err.message.includes('fetch')) {
            // Network-related error
            errorCode = CvUploadErrorCode.NETWORK_TIMEOUT;
          }
        }

        setError(errorCode);
        onError?.(errorCode);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadEndpoint, onSuccess, onError, clearError]
  );

  return {
    upload,
    isUploading,
    error,
    clearError,
    reset,
  };
}
