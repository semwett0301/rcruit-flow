import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Options for the useUploadSuccess hook
 */
export interface UseUploadSuccessOptions {
  /** Delay in milliseconds before auto-dismissing the success message (default: 5000ms) */
  autoDismissDelay?: number;
}

/**
 * Return type for the useUploadSuccess hook
 */
export interface UseUploadSuccessReturn {
  /** Whether the success message should be shown */
  showSuccess: boolean;
  /** The name of the successfully uploaded file */
  fileName: string | null;
  /** Trigger the success state with the uploaded file name */
  triggerSuccess: (fileName: string) => void;
  /** Manually dismiss the success message */
  dismissSuccess: () => void;
}

/**
 * Custom hook to manage upload success state and auto-dismiss logic.
 * 
 * Provides state management for showing upload success messages with
 * configurable auto-dismiss functionality.
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing success state and control functions
 * 
 * @example
 * ```tsx
 * const { showSuccess, fileName, triggerSuccess, dismissSuccess } = useUploadSuccess({
 *   autoDismissDelay: 3000
 * });
 * 
 * // When upload completes
 * triggerSuccess('document.pdf');
 * 
 * // Success message will auto-dismiss after 3 seconds
 * // Or manually dismiss with dismissSuccess()
 * ```
 */
export function useUploadSuccess(
  options: UseUploadSuccessOptions = {}
): UseUploadSuccessReturn {
  const { autoDismissDelay = 5000 } = options;

  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Use ref to store timeout ID for cleanup
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Clears any existing auto-dismiss timeout
   */
  const clearExistingTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Dismisses the success message and clears the file name
   */
  const dismissSuccess = useCallback(() => {
    clearExistingTimeout();
    setShowSuccess(false);
    setFileName(null);
  }, [clearExistingTimeout]);

  /**
   * Triggers the success state with the given file name
   * and sets up auto-dismiss timeout
   */
  const triggerSuccess = useCallback(
    (uploadedFileName: string) => {
      // Clear any existing timeout before setting new state
      clearExistingTimeout();
      
      setFileName(uploadedFileName);
      setShowSuccess(true);

      // Set up auto-dismiss timeout
      timeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
        setFileName(null);
        timeoutRef.current = null;
      }, autoDismissDelay);
    },
    [autoDismissDelay, clearExistingTimeout]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearExistingTimeout();
    };
  }, [clearExistingTimeout]);

  return {
    showSuccess,
    fileName,
    triggerSuccess,
    dismissSuccess,
  };
}

export default useUploadSuccess;
