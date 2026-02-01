/**
 * Custom hook for CV file upload with comprehensive error handling.
 * Provides client-side validation, upload state management, and error mapping.
 */
import { useState, useCallback } from 'react';
import { CvUploadErrorCode, CvUploadErrorResponse } from '@rcruit-flow/dto';
import { validateCvFile, mapApiErrorToCode } from '../utils/cv-upload-validator';

/**
 * Configuration options for the useCvUpload hook.
 */
interface UseCvUploadOptions {
  /** The API endpoint URL for CV uploads */
  uploadEndpoint: string;
  /** Callback invoked on successful upload with the response data */
  onSuccess?: (response: unknown) => void;
  /** Callback invoked on upload error with the error code */
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
  /** Function to reset the hook state completely */
  reset: () => void;
}

/** Upload timeout in milliseconds (30 seconds) */
const UPLOAD_TIMEOUT_MS = 30000;

/**
 * Custom hook for handling CV file uploads with validation and error handling.
 *
 * @param options - Configuration options for the upload hook
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
export function useCvUpload(options: UseCvUploadOptions): UseCvUploadReturn {
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
      // Clear any previous errors
      setError(null);

      // Perform client-side validation before upload
      const validationError = validateCvFile(file);
      if (validationError) {
        setError(validationError.code);
        options.onError?.(validationError.code);
        return;
      }

      setIsUploading(true);

      try {
        // Prepare form data for upload
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

        // Handle non-OK responses
        if (!response.ok) {
          const errorData: CvUploadErrorResponse = await response.json().catch(() => ({
            code: CvUploadErrorCode.SERVER_ERROR,
            message: 'Server error',
          }));

          const errorCode = errorData.code || CvUploadErrorCode.SERVER_ERROR;
          setError(errorCode);
          options.onError?.(errorCode);
          return;
        }

        // Parse successful response and invoke callback
        const data = await response.json();
        options.onSuccess?.(data);
      } catch (err) {
        // Map caught errors to appropriate error codes
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
}
