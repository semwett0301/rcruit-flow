import { useState, useCallback } from 'react';

/**
 * Options for the useFormReset hook
 */
export interface UseFormResetOptions {
  /** Callback function to execute when reset is confirmed */
  onReset: () => void;
  /** Whether to show a confirmation dialog before resetting. Defaults to true */
  requireConfirmation?: boolean;
}

/**
 * Return type for the useFormReset hook
 */
export interface UseFormResetReturn {
  /** Whether the reset confirmation dialog should be shown */
  showResetConfirmation: boolean;
  /** Request a form reset - shows confirmation if required, otherwise resets immediately */
  requestReset: () => void;
  /** Confirm the reset action and execute the onReset callback */
  confirmReset: () => void;
  /** Cancel the reset action and hide the confirmation dialog */
  cancelReset: () => void;
}

/**
 * Custom hook to handle form reset logic with optional confirmation.
 *
 * This hook manages the confirmation dialog state and triggers the actual
 * reset only after confirmation (if required).
 *
 * @param options - Configuration options for the hook
 * @returns Object containing confirmation state and control functions
 *
 * @example
 * ```tsx
 * const { showResetConfirmation, requestReset, confirmReset, cancelReset } = useFormReset({
 *   onReset: () => form.reset(),
 *   requireConfirmation: true,
 * });
 *
 * return (
 *   <>
 *     <button onClick={requestReset}>Reset Form</button>
 *     {showResetConfirmation && (
 *       <ConfirmDialog
 *         onConfirm={confirmReset}
 *         onCancel={cancelReset}
 *       />
 *     )}
 *   </>
 * );
 * ```
 */
export function useFormReset({
  onReset,
  requireConfirmation = true,
}: UseFormResetOptions): UseFormResetReturn {
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  /**
   * Request a form reset.
   * If confirmation is required, shows the confirmation dialog.
   * Otherwise, executes the reset immediately.
   */
  const requestReset = useCallback(() => {
    if (requireConfirmation) {
      setShowResetConfirmation(true);
    } else {
      onReset();
    }
  }, [requireConfirmation, onReset]);

  /**
   * Confirm the reset action.
   * Hides the confirmation dialog and executes the onReset callback.
   */
  const confirmReset = useCallback(() => {
    setShowResetConfirmation(false);
    onReset();
  }, [onReset]);

  /**
   * Cancel the reset action.
   * Hides the confirmation dialog without executing the reset.
   */
  const cancelReset = useCallback(() => {
    setShowResetConfirmation(false);
  }, []);

  return {
    showResetConfirmation,
    requestReset,
    confirmReset,
    cancelReset,
  };
}

export default useFormReset;
