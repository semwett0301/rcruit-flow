/**
 * Custom hook to manage upload success state and timing.
 * Provides state management for displaying upload success feedback
 * with optional auto-dismiss functionality.
 */
import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseUploadSuccessOptions {
  /** Auto-dismiss delay in milliseconds. Set to 0 to disable auto-dismiss. */
  autoDismissDelay?: number;
}

export interface UseUploadSuccessReturn {
  /** Whether the success state is currently active */
  isSuccess: boolean;
  /** The name of the successfully uploaded file, if provided */
  fileName: string | null;
  /** Show the success state, optionally with a file name */
  showSuccess: (fileName?: string) => void;
  /** Dismiss the success state (keeps fileName for potential reference) */
  dismissSuccess: () => void;
  /** Fully reset the success state and clear fileName */
  resetSuccess: () => void;
}

/**
 * Hook to manage upload success state with optional auto-dismiss.
 *
 * @param options - Configuration options for the hook
 * @returns Object containing success state and control functions
 *
 * @example
 * ```tsx
 * const { isSuccess, fileName, showSuccess, dismissSuccess } = useUploadSuccess({
 *   autoDismissDelay: 3000
 * });
 *
 * // After successful upload
 * showSuccess('document.pdf');
 *
 * // Manually dismiss if needed
 * dismissSuccess();
 * ```
 */
export const useUploadSuccess = (
  options: UseUploadSuccessOptions = {}
): UseUploadSuccessReturn => {
  const { autoDismissDelay = 0 } = options;
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showSuccess = useCallback(
    (uploadedFileName?: string) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setFileName(uploadedFileName || null);
      setIsSuccess(true);

      if (autoDismissDelay > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsSuccess(false);
          setFileName(null);
          timeoutRef.current = null;
        }, autoDismissDelay);
      }
    },
    [autoDismissDelay]
  );

  const dismissSuccess = useCallback(() => {
    // Clear any pending auto-dismiss timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsSuccess(false);
  }, []);

  const resetSuccess = useCallback(() => {
    // Clear any pending auto-dismiss timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsSuccess(false);
    setFileName(null);
  }, []);

  return {
    isSuccess,
    fileName,
    showSuccess,
    dismissSuccess,
    resetSuccess,
  };
};

export default useUploadSuccess;
