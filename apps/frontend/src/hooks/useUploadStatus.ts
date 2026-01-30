import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Interface representing the upload status state.
 */
export interface UploadStatus {
  /** Current status of the upload */
  status: 'idle' | 'uploading' | 'success' | 'error';
  /** Optional message (typically for error descriptions) */
  message?: string;
  /** Name of the file being uploaded */
  fileName?: string;
}

/**
 * Return type for the useUploadStatus hook.
 */
export interface UseUploadStatusReturn {
  /** Current upload status */
  uploadStatus: UploadStatus;
  /** Set status to 'success' with the uploaded file name */
  setSuccess: (fileName: string) => void;
  /** Set status to 'error' with an error message */
  setError: (message: string) => void;
  /** Set status to 'uploading' */
  setUploading: () => void;
  /** Reset to 'idle' state */
  reset: () => void;
}

/** Auto-dismiss timeout for success state in milliseconds */
const SUCCESS_AUTO_DISMISS_MS = 5000;

/** Initial idle state */
const initialStatus: UploadStatus = {
  status: 'idle',
};

/**
 * Custom hook to manage upload status state including success/error states.
 *
 * Provides a simple interface to track file upload progress through
 * various states: idle, uploading, success, and error.
 * 
 * The success state automatically dismisses after 5 seconds.
 *
 * @returns {UseUploadStatusReturn} Object containing upload status and state setters
 *
 * @example
 * ```tsx
 * const { uploadStatus, setUploading, setSuccess, setError, reset } = useUploadStatus();
 *
 * const handleUpload = async (file: File) => {
 *   setUploading();
 *   try {
 *     await uploadFile(file);
 *     setSuccess(file.name); // Will auto-dismiss after 5 seconds
 *   } catch (err) {
 *     setError(err.message);
 *   }
 * };
 * ```
 */
export function useUploadStatus(): UseUploadStatusReturn {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(initialStatus);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /**
   * Clears any existing auto-dismiss timer.
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Sets the upload status to 'uploading'.
   */
  const setUploading = useCallback(() => {
    clearTimer();
    setUploadStatus({
      status: 'uploading',
    });
  }, [clearTimer]);

  /**
   * Sets the upload status to 'success' with the file name.
   * Automatically resets to 'idle' after 5 seconds.
   * @param fileName - The name of the successfully uploaded file
   */
  const setSuccess = useCallback((fileName: string) => {
    clearTimer();
    setUploadStatus({
      status: 'success',
      fileName,
    });

    // Auto-dismiss success state after timeout
    timerRef.current = setTimeout(() => {
      setUploadStatus(initialStatus);
      timerRef.current = null;
    }, SUCCESS_AUTO_DISMISS_MS);
  }, [clearTimer]);

  /**
   * Sets the upload status to 'error' with an error message.
   * @param message - The error message to display
   */
  const setError = useCallback((message: string) => {
    clearTimer();
    setUploadStatus({
      status: 'error',
      message,
    });
  }, [clearTimer]);

  /**
   * Resets the upload status to 'idle'.
   */
  const reset = useCallback(() => {
    clearTimer();
    setUploadStatus(initialStatus);
  }, [clearTimer]);

  return {
    uploadStatus,
    setSuccess,
    setError,
    setUploading,
    reset,
  };
}

export default useUploadStatus;
