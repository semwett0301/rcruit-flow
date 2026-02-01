/**
 * Custom hook for CV file upload with comprehensive error handling.
 * Provides client-side validation, upload state management, and user-friendly error messages.
 */
import { useState, useCallback } from 'react';
import { CvUploadErrorCode } from '@recruit-flow/dto';
import { validateCvFile } from '../utils/cv-upload-validator';
import {
  mapApiErrorToUploadError,
  getFormattedError,
  FormattedUploadError,
} from '../utils/cv-upload-error-handler';

/**
 * Options for configuring the CV upload hook.
 */
interface UseCvUploadOptions {
  /** Callback invoked on successful upload */
  onSuccess?: (response: unknown) => void;
  /** Callback invoked when an error occurs */
  onError?: (error: FormattedUploadError) => void;
  /** Custom upload endpoint URL (defaults to '/api/cv/upload') */
  uploadEndpoint?: string;
}

/**
 * Return type for the useCvUpload hook.
 */
interface UseCvUploadReturn {
  /** Function to upload a CV file */
  upload: (file: File) => Promise<void>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Current error, if any */
  error: FormattedUploadError | null;
  /** Function to clear the current error */
  clearError: () => void;
  /** Upload progress percentage (0-100) */
  progress: number;
}

/**
 * Custom hook for handling CV file uploads with validation and error handling.
 *
 * Features:
 * - Client-side file validation (size, type, empty file checks)
 * - Upload state management (loading, progress, error states)
 * - User-friendly error messages mapped from error codes
 * - Configurable callbacks for success and error handling
 * - Customizable upload endpoint
 *
 * @param options - Configuration options for the upload hook
 * @returns Object containing upload state and utility functions
 *
 * @example
 * ```tsx
 * const { upload, isUploading, error, clearError, progress } = useCvUpload({
 *   onSuccess: (response) => console.log('Upload successful:', response),
 *   onError: (error) => console.error('Upload failed:', error.message),
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
 *     <p>{error.title}</p>
 *     <p>{error.message}</p>
 *     <button onClick={clearError}>Dismiss</button>
 *   </div>
 * )}
 * ```
 */
export function useCvUpload(options: UseCvUploadOptions = {}): UseCvUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<FormattedUploadError | null>(null);
  const [progress, setProgress] = useState(0);

  /**
   * Clears the current error state.
   */
  const clearError = useCallback(() => {
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
      // Reset state before starting upload
      setError(null);
      setProgress(0);

      // Perform client-side validation
      const validation = validateCvFile(file);
      if (!validation.isValid && validation.errorCode) {
        const formattedError = getFormattedError(validation.errorCode);
        setError(formattedError);
        options.onError?.(formattedError);
        return;
      }

      setIsUploading(true);

      try {
        // Prepare form data for upload
        const formData = new FormData();
        formData.append('cv', file);

        const response = await fetch(options.uploadEndpoint || '/api/cv/upload', {
          method: 'POST',
          body: formData,
        });

        // Handle non-OK responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw { response: { data: errorData } };
        }

        // Parse successful response
        const data = await response.json();
        setProgress(100);
        options.onSuccess?.(data);
      } catch (err) {
        // Map API error to user-friendly format
        const formattedError = mapApiErrorToUploadError(err);
        setError(formattedError);
        options.onError?.(formattedError);
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  return {
    upload,
    isUploading,
    error,
    clearError,
    progress,
  };
}
