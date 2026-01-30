/**
 * Custom hook for CV file upload with comprehensive error handling.
 * 
 * Provides client-side validation, upload state management, and
 * standardized error handling for CV uploads.
 */
import { useState, useCallback } from 'react';
import { CvUploadErrorResponse } from '@rcruit-flow/dto';
import { validateFileBeforeUpload, mapApiErrorToUploadError } from '../utils/cv-upload-error-handler';

/**
 * Configuration options for the useCvUpload hook.
 */
interface UseCvUploadOptions {
  /** The API endpoint URL for CV uploads */
  uploadEndpoint: string;
  /** Callback invoked on successful upload */
  onSuccess?: (response: unknown) => void;
  /** Callback invoked when an error occurs */
  onError?: (error: CvUploadErrorResponse) => void;
}

/**
 * Return type for the useCvUpload hook.
 */
interface UseCvUploadReturn {
  /** Function to initiate file upload */
  upload: (file: File) => Promise<void>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Current error state, if any */
  error: CvUploadErrorResponse | null;
  /** Function to clear the current error */
  clearError: () => void;
  /** Function to reset all state (uploading and error) */
  reset: () => void;
}

/**
 * Custom hook for handling CV file uploads with proper error handling.
 * 
 * Features:
 * - Client-side file validation before upload
 * - Upload progress state management
 * - Standardized error handling and mapping
 * - Callbacks for success and error scenarios
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing upload function and state
 * 
 * @example
 * ```tsx
 * const { upload, isUploading, error, clearError } = useCvUpload({
 *   uploadEndpoint: '/api/cv/upload',
 *   onSuccess: (data) => console.log('Uploaded:', data),
 *   onError: (err) => console.error('Failed:', err.message),
 * });
 * 
 * const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     upload(file);
 *   }
 * };
 * ```
 */
export function useCvUpload({
  uploadEndpoint,
  onSuccess,
  onError,
}: UseCvUploadOptions): UseCvUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<CvUploadErrorResponse | null>(null);

  /**
   * Clears the current error state.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Resets all hook state to initial values.
   */
  const reset = useCallback(() => {
    setIsUploading(false);
    setError(null);
  }, []);

  /**
   * Uploads a CV file to the configured endpoint.
   * 
   * Performs client-side validation before uploading and handles
   * all error scenarios with standardized error responses.
   * 
   * @param file - The file to upload
   */
  const upload = useCallback(
    async (file: File) => {
      // Clear any previous errors
      setError(null);

      // Perform client-side validation before upload
      const validationError = validateFileBeforeUpload(file);
      if (validationError) {
        setError(validationError);
        onError?.(validationError);
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('cv', file);

        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          // Attempt to parse error response, fallback to empty object
          const errorData = await response.json().catch(() => ({}));
          const uploadError = mapApiErrorToUploadError({
            response: { data: errorData, status: response.status },
          });
          setError(uploadError);
          onError?.(uploadError);
          return;
        }

        const data = await response.json();
        onSuccess?.(data);
      } catch (err) {
        // Handle network errors and other unexpected failures
        const uploadError = mapApiErrorToUploadError(err);
        setError(uploadError);
        onError?.(uploadError);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadEndpoint, onSuccess, onError]
  );

  return {
    upload,
    isUploading,
    error,
    clearError,
    reset,
  };
}
