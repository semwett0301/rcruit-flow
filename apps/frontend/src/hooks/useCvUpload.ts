/**
 * Custom hook for CV file upload with comprehensive error handling.
 * Provides client-side validation, upload state management, and error mapping.
 */
import { useState, useCallback } from 'react';
import { CvUploadErrorCode, CvUploadErrorResponse } from '@repo/dto';
import { validateCvFile, mapApiErrorToCode } from '../utils/cv-upload-validator';

/**
 * Configuration options for the useCvUpload hook.
 */
interface UseCvUploadOptions {
  /** The API endpoint URL for CV upload */
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
  /** Function to initiate file upload */
  upload: (file: File) => Promise<void>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Current error code, if any */
  error: CvUploadErrorCode | null;
  /** Function to clear the current error */
  clearError: () => void;
  /** Function to reset the hook state */
  reset: () => void;
}

/** Upload timeout in milliseconds (60 seconds) */
const UPLOAD_TIMEOUT_MS = 60000;

/**
 * Custom hook for handling CV file uploads with validation and error handling.
 *
 * @param options - Configuration options for the upload
 * @returns Object containing upload function and state
 *
 * @example
 * ```tsx
 * const { upload, isUploading, error, clearError } = useCvUpload({
 *   uploadEndpoint: '/api/cv/upload',
 *   onSuccess: (data) => console.log('Uploaded:', data),
 *   onError: (code) => console.error('Error:', code),
 * });
 *
 * const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) upload(file);
 * };
 * ```
 */
export const useCvUpload = (options: UseCvUploadOptions): UseCvUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<CvUploadErrorCode | null>(null);

  /**
   * Clears the current error state.
   */
  const clearError = useCallback(() => setError(null), []);

  /**
   * Resets the hook to its initial state.
   */
  const reset = useCallback(() => {
    setIsUploading(false);
    setError(null);
  }, []);

  /**
   * Uploads a CV file to the configured endpoint.
   * Performs client-side validation before uploading.
   *
   * @param file - The file to upload
   */
  const upload = useCallback(
    async (file: File) => {
      // Clear any previous error
      setError(null);

      // Perform client-side validation
      const validationError = validateCvFile(file);
      if (validationError) {
        setError(validationError.code);
        options.onError?.(validationError.code);
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('cv', file);

        // Set up abort controller for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

        const response = await fetch(options.uploadEndpoint, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Attempt to parse error response, fallback to generic server error
          const errorData: CvUploadErrorResponse = await response.json().catch(() => ({
            code: CvUploadErrorCode.SERVER_ERROR,
            message: 'Server error',
          }));

          const errorCode = errorData.code || CvUploadErrorCode.SERVER_ERROR;
          setError(errorCode);
          options.onError?.(errorCode);
          return;
        }

        const data = await response.json();
        options.onSuccess?.(data);
      } catch (err) {
        // Map network/abort errors to appropriate error codes
        const errorCode = mapApiErrorToCode(err);
        setError(errorCode);
        options.onError?.(errorCode);
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  return { upload, isUploading, error, clearError, reset };
};
