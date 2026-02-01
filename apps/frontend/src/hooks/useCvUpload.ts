/**
 * Custom hook for CV file upload with comprehensive error handling.
 * Provides upload state management, retry functionality, and user-friendly error mapping.
 */
import { useState, useCallback } from 'react';
import { CvUploadErrorResponse } from '@repo/dto';
import {
  UserFriendlyError,
  mapCvUploadErrorToUserMessage,
  mapNetworkErrorToUploadError,
  mapUnknownErrorToUploadError,
} from '../utils/cv-upload-error-messages';

/**
 * Configuration options for the useCvUpload hook.
 */
interface UseCvUploadOptions {
  /** The API endpoint URL for CV upload */
  uploadEndpoint: string;
  /** Callback invoked on successful upload */
  onSuccess?: (response: unknown) => void;
  /** Callback invoked when an error occurs */
  onError?: (error: UserFriendlyError) => void;
}

/**
 * Return type for the useCvUpload hook.
 */
interface UseCvUploadReturn {
  /** Function to initiate file upload */
  upload: (file: File) => Promise<void>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Current user-friendly error, if any */
  error: UserFriendlyError | null;
  /** Function to clear the current error */
  clearError: () => void;
  /** Function to retry the last failed upload */
  retry: () => void;
}

/** Upload timeout in milliseconds (30 seconds) */
const UPLOAD_TIMEOUT_MS = 30000;

/**
 * Custom hook for handling CV file uploads with error handling and retry support.
 *
 * @param options - Configuration options for the upload
 * @returns Object containing upload function, state, and control methods
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
export function useCvUpload(options: UseCvUploadOptions): UseCvUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<UserFriendlyError | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);

  /**
   * Uploads a CV file to the configured endpoint.
   *
   * @param file - The file to upload
   */
  const upload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError(null);
      setLastFile(file);

      const formData = new FormData();
      formData.append('cv', file);

      try {
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
          // Attempt to parse error response from server
          const errorData: CvUploadErrorResponse = await response.json();
          const userError = mapCvUploadErrorToUserMessage(errorData);
          setError(userError);
          options.onError?.(userError);
          return;
        }

        const data = await response.json();
        options.onSuccess?.(data);
      } catch (err) {
        // Map network/abort errors to user-friendly error messages
        let errorResponse: CvUploadErrorResponse;

        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted due to timeout
          errorResponse = mapNetworkErrorToUploadError();
        } else {
          // Unknown error (network failure, etc.)
          errorResponse = mapUnknownErrorToUploadError();
        }

        const userError = mapCvUploadErrorToUserMessage(errorResponse);
        setError(userError);
        options.onError?.(userError);
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  /**
   * Clears the current error state.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Retries the last failed upload.
   * Does nothing if no previous upload attempt exists.
   */
  const retry = useCallback(() => {
    if (lastFile) {
      upload(lastFile);
    }
  }, [lastFile, upload]);

  return { upload, isUploading, error, clearError, retry };
}
