/**
 * Custom hook for CV file upload with comprehensive error handling.
 * Provides client-side validation, upload state management, error mapping,
 * and retry functionality.
 */
import { useState, useCallback } from 'react';
import { CvUploadErrorCode } from '@rcruit-flow/dto';
import { validateCvFile } from '../utils/cv-upload-validator';
import { handleCvUploadError, FormattedUploadError } from '../utils/cv-upload-error-handler';

/**
 * Configuration options for the useCvUpload hook.
 */
interface UseCvUploadOptions {
  /** The API endpoint URL for CV uploads */
  uploadEndpoint: string;
  /** Callback invoked on successful upload with the response data */
  onSuccess?: (response: unknown) => void;
  /** Callback invoked on upload error with the formatted error */
  onError?: (error: FormattedUploadError) => void;
}

/**
 * Return type for the useCvUpload hook.
 */
interface UseCvUploadReturn {
  /** Function to initiate file upload */
  upload: (file: File) => Promise<void>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Current formatted error, if any */
  error: FormattedUploadError | null;
  /** Function to clear the current error */
  clearError: () => void;
  /** Function to retry the last failed upload */
  retry: () => void;
}

/**
 * Custom hook for handling CV file uploads with validation and error handling.
 *
 * Features:
 * - Client-side file validation before upload
 * - Comprehensive error mapping from HTTP responses
 * - Upload state management (loading, error states)
 * - Formatted error messages for user display
 * - Retry functionality for failed uploads
 * - Callbacks for success and error handling
 *
 * @param options - Configuration options for the upload hook
 * @returns Object containing upload function, state, and utility functions
 *
 * @example
 * ```tsx
 * const { upload, isUploading, error, clearError, retry } = useCvUpload({
 *   uploadEndpoint: '/api/cv/upload',
 *   onSuccess: (data) => console.log('Uploaded:', data),
 *   onError: (error) => console.error('Error:', error.message),
 * });
 *
 * const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) upload(file);
 * };
 *
 * // Retry last failed upload
 * const handleRetry = () => retry();
 * ```
 */
export function useCvUpload({
  uploadEndpoint,
  onSuccess,
  onError,
}: UseCvUploadOptions): UseCvUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<FormattedUploadError | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);

  /**
   * Clears the current error state.
   */
  const clearError = useCallback(() => setError(null), []);

  /**
   * Uploads a CV file to the configured endpoint.
   * Performs client-side validation before uploading.
   *
   * @param file - The file to upload
   */
  const upload = useCallback(
    async (file: File) => {
      // Store file for potential retry
      setLastFile(file);
      // Clear any previous errors
      setError(null);

      // Perform client-side validation before upload
      const validation = validateCvFile(file);
      if (!validation.isValid && validation.errorCode) {
        const formattedError = handleCvUploadError({
          code: validation.errorCode,
          message: '',
        });
        setError(formattedError);
        onError?.(formattedError);
        return;
      }

      setIsUploading(true);

      try {
        // Prepare form data for upload
        const formData = new FormData();
        formData.append('cv', file);

        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        // Handle non-OK responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw { response: { status: response.status }, ...errorData };
        }

        // Parse successful response and invoke callback
        const data = await response.json();
        onSuccess?.(data);
      } catch (err) {
        // Map caught errors to formatted error objects
        const formattedError = handleCvUploadError(err);
        setError(formattedError);
        onError?.(formattedError);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadEndpoint, onSuccess, onError]
  );

  /**
   * Retries the last failed upload.
   * Does nothing if no file was previously uploaded.
   */
  const retry = useCallback(() => {
    if (lastFile) {
      upload(lastFile);
    }
  }, [lastFile, upload]);

  return { upload, isUploading, error, clearError, retry };
}
