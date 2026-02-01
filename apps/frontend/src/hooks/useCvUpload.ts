/**
 * Custom hook for CV file upload with comprehensive error handling.
 * Provides client-side validation, upload state management, and user-friendly error messages.
 */
import { useState, useCallback } from 'react';
import {
  CvUploadErrorCode,
  CvUploadErrorResponse,
  CV_UPLOAD_CONSTRAINTS,
} from '@rcruit-flow/dto';
import { getErrorMessage, UserFriendlyError } from '../constants/cv-upload-messages';

/**
 * Internal state for tracking upload progress and status.
 */
interface UploadState {
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Upload progress percentage (0-100) */
  progress: number;
  /** Current error, if any */
  error: UserFriendlyError | null;
  /** Whether the last upload was successful */
  success: boolean;
}

/**
 * Result returned from a successful upload.
 */
interface UploadResult {
  /** Unique identifier for the uploaded CV */
  id: string;
  /** Original filename of the uploaded file */
  filename: string;
}

/**
 * Return type for the useCvUpload hook.
 */
interface UseCvUploadReturn extends UploadState {
  /** Function to upload a CV file */
  uploadCv: (file: File) => Promise<UploadResult | null>;
  /** Function to clear the current error */
  clearError: () => void;
  /** Function to reset all state to initial values */
  reset: () => void;
}

/**
 * Initial state for the upload hook.
 */
const INITIAL_STATE: UploadState = {
  isUploading: false,
  progress: 0,
  error: null,
  success: false,
};

/**
 * Custom hook for handling CV file uploads with validation and error handling.
 *
 * Features:
 * - Client-side file validation (size, type, empty file checks)
 * - Upload state management (loading, progress, error, success states)
 * - User-friendly error messages mapped from error codes
 * - Network error detection
 * - State reset and error clearing utilities
 *
 * @returns Object containing upload state and utility functions
 *
 * @example
 * ```tsx
 * const { isUploading, progress, error, success, uploadCv, clearError, reset } = useCvUpload();
 *
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     const result = await uploadCv(file);
 *     if (result) {
 *       console.log('Uploaded CV:', result.id, result.filename);
 *     }
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
export const useCvUpload = (): UseCvUploadReturn => {
  const [state, setState] = useState<UploadState>(INITIAL_STATE);

  /**
   * Validates a file locally before upload.
   * Checks for empty files, file size limits, and allowed extensions.
   *
   * @param file - The file to validate
   * @returns UserFriendlyError if validation fails, null if valid
   */
  const validateFileLocally = useCallback((file: File): UserFriendlyError | null => {
    // Check if file exists
    if (!file) {
      return getErrorMessage(CvUploadErrorCode.EMPTY_FILE);
    }

    // Check for empty file
    if (file.size === 0) {
      return getErrorMessage(CvUploadErrorCode.EMPTY_FILE);
    }

    // Check file size limit
    if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      return getErrorMessage(CvUploadErrorCode.FILE_TOO_LARGE);
    }

    // Check file extension
    const filenameParts = file.name.split('.');
    const extension = filenameParts.length > 1
      ? '.' + filenameParts.pop()?.toLowerCase()
      : '';

    if (!extension || !CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
      return getErrorMessage(CvUploadErrorCode.INVALID_FILE_TYPE);
    }

    return null;
  }, []);

  /**
   * Uploads a CV file to the server.
   * Performs client-side validation before uploading.
   *
   * @param file - The CV file to upload
   * @returns UploadResult on success, null on failure
   */
  const uploadCv = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      // Reset state and start upload
      setState({
        isUploading: true,
        progress: 0,
        error: null,
        success: false,
      });

      // Perform client-side validation
      const validationError = validateFileLocally(file);
      if (validationError) {
        setState({
          isUploading: false,
          progress: 0,
          error: validationError,
          success: false,
        });
        return null;
      }

      try {
        // Prepare form data for upload
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/cv/upload', {
          method: 'POST',
          body: formData,
        });

        // Handle non-OK responses
        if (!response.ok) {
          let errorData: CvUploadErrorResponse;
          try {
            errorData = await response.json();
          } catch {
            // If response is not valid JSON, use unknown error
            errorData = {
              code: CvUploadErrorCode.UNKNOWN_ERROR,
              message: 'An unexpected error occurred',
            };
          }

          const userError = getErrorMessage(errorData.code);
          setState({
            isUploading: false,
            progress: 0,
            error: userError,
            success: false,
          });
          return null;
        }

        // Parse successful response
        const result: UploadResult = await response.json();
        setState({
          isUploading: false,
          progress: 100,
          error: null,
          success: true,
        });
        return result;
      } catch (error) {
        // Determine error type
        let errorCode = CvUploadErrorCode.UNKNOWN_ERROR;

        // Check for network errors
        if (error instanceof TypeError) {
          const errorMessage = error.message.toLowerCase();
          if (
            errorMessage.includes('network') ||
            errorMessage.includes('fetch') ||
            errorMessage.includes('failed to fetch')
          ) {
            errorCode = CvUploadErrorCode.NETWORK_TIMEOUT;
          }
        }

        const userError = getErrorMessage(errorCode);
        setState({
          isUploading: false,
          progress: 0,
          error: userError,
          success: false,
        });
        return null;
      }
    },
    [validateFileLocally]
  );

  /**
   * Clears the current error state while preserving other state.
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Resets all state to initial values.
   */
  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    ...state,
    uploadCv,
    clearError,
    reset,
  };
};
