/**
 * Custom hook for managing file upload status state.
 * Provides a clean interface for tracking upload progress, success, and error states.
 */
import { useState, useCallback } from 'react';

/**
 * Possible states for an upload operation
 */
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

/**
 * State shape for upload tracking
 */
export interface UploadState {
  status: UploadStatus;
  fileName: string | null;
  errorMessage: string | null;
}

/**
 * Return type for the useUploadStatus hook
 */
export interface UseUploadStatusReturn {
  uploadState: UploadState;
  setUploading: (fileName: string) => void;
  setSuccess: (fileName: string) => void;
  setError: (errorMessage: string) => void;
  reset: () => void;
  isSuccess: boolean;
  isUploading: boolean;
  isError: boolean;
}

/**
 * Initial state for upload tracking
 */
const initialState: UploadState = {
  status: 'idle',
  fileName: null,
  errorMessage: null,
};

/**
 * Custom hook to manage upload status state including success state.
 *
 * @returns {UseUploadStatusReturn} Object containing upload state and control functions
 *
 * @example
 * ```tsx
 * const {
 *   uploadState,
 *   setUploading,
 *   setSuccess,
 *   setError,
 *   reset,
 *   isSuccess,
 *   isUploading,
 *   isError
 * } = useUploadStatus();
 *
 * // Start upload
 * setUploading('document.pdf');
 *
 * // On success
 * setSuccess('document.pdf');
 *
 * // On error
 * setError('Upload failed: Network error');
 *
 * // Reset to initial state
 * reset();
 * ```
 */
export const useUploadStatus = (): UseUploadStatusReturn => {
  const [uploadState, setUploadState] = useState<UploadState>(initialState);

  /**
   * Set the upload state to 'uploading' with the given file name
   */
  const setUploading = useCallback((fileName: string) => {
    setUploadState({ status: 'uploading', fileName, errorMessage: null });
  }, []);

  /**
   * Set the upload state to 'success' with the given file name
   */
  const setSuccess = useCallback((fileName: string) => {
    setUploadState({ status: 'success', fileName, errorMessage: null });
  }, []);

  /**
   * Set the upload state to 'error' with the given error message
   * Preserves the current file name
   */
  const setError = useCallback((errorMessage: string) => {
    setUploadState(prev => ({ ...prev, status: 'error', errorMessage }));
  }, []);

  /**
   * Reset the upload state to initial values
   */
  const reset = useCallback(() => {
    setUploadState(initialState);
  }, []);

  return {
    uploadState,
    setUploading,
    setSuccess,
    setError,
    reset,
    isSuccess: uploadState.status === 'success',
    isUploading: uploadState.status === 'uploading',
    isError: uploadState.status === 'error',
  };
};
