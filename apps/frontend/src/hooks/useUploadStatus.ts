import { useState, useCallback } from 'react';

/**
 * Upload status types representing different states of a file upload.
 */
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'processing' | 'error';

/**
 * Interface representing the current upload state.
 */
export interface UploadState {
  /** Current status of the upload */
  status: UploadStatus;
  /** Name of the file being uploaded (available in success/processing states) */
  fileName?: string;
  /** Error message (available in error state) */
  errorMessage?: string;
}

/**
 * Return type for the useUploadStatus hook.
 */
export interface UseUploadStatusReturn {
  /** Current upload state */
  uploadState: UploadState;
  /** Set status to 'uploading' */
  setUploading: () => void;
  /** Set status to 'success' with the uploaded file name */
  setSuccess: (fileName: string) => void;
  /** Set status to 'processing' with the file name being processed */
  setProcessing: (fileName: string) => void;
  /** Set status to 'error' with an error message */
  setError: (message: string) => void;
  /** Reset to 'idle' state */
  reset: () => void;
}

/** Initial idle state */
const initialState: UploadState = {
  status: 'idle',
};

/**
 * Custom hook to manage upload status states.
 *
 * Provides a simple interface to track file upload progress through
 * various states: idle, uploading, success, processing, and error.
 *
 * @returns {UseUploadStatusReturn} Object containing upload state and state setters
 *
 * @example
 * ```tsx
 * const { uploadState, setUploading, setSuccess, setError, reset } = useUploadStatus();
 *
 * const handleUpload = async (file: File) => {
 *   setUploading();
 *   try {
 *     await uploadFile(file);
 *     setSuccess(file.name);
 *   } catch (err) {
 *     setError(err.message);
 *   }
 * };
 * ```
 */
export function useUploadStatus(): UseUploadStatusReturn {
  const [uploadState, setUploadState] = useState<UploadState>(initialState);

  const setUploading = useCallback(() => {
    setUploadState({
      status: 'uploading',
    });
  }, []);

  const setSuccess = useCallback((fileName: string) => {
    setUploadState({
      status: 'success',
      fileName,
    });
  }, []);

  const setProcessing = useCallback((fileName: string) => {
    setUploadState({
      status: 'processing',
      fileName,
    });
  }, []);

  const setError = useCallback((message: string) => {
    setUploadState({
      status: 'error',
      errorMessage: message,
    });
  }, []);

  const reset = useCallback(() => {
    setUploadState(initialState);
  }, []);

  return {
    uploadState,
    setUploading,
    setSuccess,
    setProcessing,
    setError,
    reset,
  };
}

export default useUploadStatus;
