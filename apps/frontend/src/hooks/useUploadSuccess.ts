import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Success data containing file information and timestamp
 */
export interface SuccessData {
  /** The name of the successfully uploaded file */
  fileName: string;
  /** Timestamp when the upload succeeded */
  timestamp: Date;
}

/**
 * Options for the useUploadSuccess hook
 */
export interface UseUploadSuccessOptions {
  /** Delay in milliseconds before auto-dismissing the success message (default: 8000ms) */
  autoDismissDelay?: number;
}

/**
 * Return type for the useUploadSuccess hook
 */
export interface UseUploadSuccessReturn {
  /** Whether the success message should be shown */
  showSuccess: boolean;
  /** Success data containing file name and timestamp, or null if not showing */
  successData: SuccessData | null;
  /** Trigger the success state with the uploaded file name */
  triggerSuccess: (fileName: string) => void;
  /** Manually dismiss the success message */
  dismissSuccess: () => void;
}

/**
 * Custom hook to manage upload success state and auto-dismiss logic.
 * 
 * Provides state management for showing upload success messages with
 * configurable auto-dismiss functionality. Handles the distinction between
 * upload and processing success states by tracking timestamps.
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing success state and control functions
 * 
 * @example
 * ```tsx
 * const { showSuccess, successData, triggerSuccess, dismissSuccess } = useUploadSuccess({
 *   autoDismissDelay: 5000
 * });
 * 
 * // When upload completes
 * triggerSuccess('document.pdf');
 * 
 * // Access success data
 * if (showSuccess && successData) {
 *   console.log(`${successData.fileName} uploaded at ${successData.timestamp}`);
 * }
 * 
 * // Success message will auto-dismiss after 8 seconds (default)
 * // Or manually dismiss with dismissSuccess()
 * ```
 */
export function useUploadSuccess(
  options: UseUploadSuccessOptions = {}
): UseUploadSuccessReturn {
  const { autoDismissDelay = 8000 } = options;

  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  
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
   * Dismisses the success message and clears the success data
   */
  const dismissSuccess = useCallback(() => {
    clearExistingTimeout();
    setShowSuccess(false);
    setSuccessData(null);
  }, [clearExistingTimeout]);

  /**
   * Triggers the success state with the given file name
   * and sets up auto-dismiss timeout.
   * Records the timestamp when success was triggered to distinguish
   * between upload and processing success states.
   */
  const triggerSuccess = useCallback(
    (fileName: string) => {
      // Clear any existing timeout before setting new state
      clearExistingTimeout();
      
      const newSuccessData: SuccessData = {
        fileName,
        timestamp: new Date(),
      };
      
      setSuccessData(newSuccessData);
      setShowSuccess(true);

      // Set up auto-dismiss timeout
      timeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
        setSuccessData(null);
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
    successData,
    triggerSuccess,
    dismissSuccess,
  };
}

export default useUploadSuccess;
