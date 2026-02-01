/**
 * Custom hook for handling CV upload errors with user-friendly messages.
 * Provides state management and utilities for CV upload error handling.
 */
import { useState, useCallback } from 'react';
import { CvUploadErrorCode } from '@rcruit-flow/dto';
import { CV_UPLOAD_ERROR_MESSAGES } from '../constants/cv-upload-messages';
import { mapHttpErrorToCvUploadError } from '../utils/cv-upload-validation';

/**
 * Represents the state of a CV upload error with user-friendly information.
 */
interface CvUploadErrorState {
  /** The error code identifying the type of error */
  code: CvUploadErrorCode | null;
  /** User-friendly title for the error */
  title: string;
  /** Detailed error message explaining what went wrong */
  message: string;
  /** Suggested action for the user to resolve the error */
  action: string;
}

/**
 * Return type for the useCvUploadError hook.
 */
interface UseCvUploadErrorReturn {
  /** Current error state, null if no error */
  error: CvUploadErrorState | null;
  /** Set error state by providing an error code */
  setErrorByCode: (code: CvUploadErrorCode) => void;
  /** Set error state from an exception (maps HTTP errors to CV upload errors) */
  setErrorFromException: (exception: unknown) => void;
  /** Clear the current error state */
  clearError: () => void;
  /** Boolean indicating whether there is an active error */
  hasError: boolean;
}

/**
 * Custom hook to handle CV upload errors and return user-friendly messages.
 *
 * @returns Object containing error state and methods to manage errors
 *
 * @example
 * ```tsx
 * const { error, setErrorFromException, clearError, hasError } = useCvUploadError();
 *
 * const handleUpload = async (file: File) => {
 *   clearError();
 *   try {
 *     await uploadCv(file);
 *   } catch (e) {
 *     setErrorFromException(e);
 *   }
 * };
 *
 * if (hasError && error) {
 *   return <ErrorDisplay title={error.title} message={error.message} action={error.action} />;
 * }
 * ```
 */
export function useCvUploadError(): UseCvUploadErrorReturn {
  const [error, setError] = useState<CvUploadErrorState | null>(null);

  /**
   * Sets the error state based on a specific error code.
   * Retrieves the corresponding user-friendly message from CV_UPLOAD_ERROR_MESSAGES.
   */
  const setErrorByCode = useCallback((code: CvUploadErrorCode) => {
    const errorInfo = CV_UPLOAD_ERROR_MESSAGES[code];
    setError({
      code,
      ...errorInfo,
    });
  }, []);

  /**
   * Sets the error state from an exception.
   * Maps HTTP errors to appropriate CV upload error codes.
   */
  const setErrorFromException = useCallback(
    (exception: unknown) => {
      const code = mapHttpErrorToCvUploadError(exception);
      setErrorByCode(code);
    },
    [setErrorByCode]
  );

  /**
   * Clears the current error state.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setErrorByCode,
    setErrorFromException,
    clearError,
    hasError: error !== null,
  };
}
