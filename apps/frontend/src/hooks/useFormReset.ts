import { useState, useCallback } from 'react';

/**
 * Options for the useFormReset hook
 */
export interface UseFormResetOptions {
  /** Callback function to execute when reset is confirmed */
  onReset: () => void;
}

/**
 * Return type for the useFormReset hook
 */
export interface UseFormResetReturn {
  /** Whether the confirmation dialog is currently open */
  isConfirmOpen: boolean;
  /** Opens the confirmation dialog */
  openConfirmDialog: () => void;
  /** Closes the confirmation dialog */
  closeConfirmDialog: () => void;
  /** Confirms the reset action, calls onReset and closes the dialog */
  confirmReset: () => void;
}

/**
 * Custom hook to handle form reset logic with confirmation state management.
 *
 * Provides state and handlers for managing a reset confirmation dialog flow.
 *
 * @param options - Configuration options including the onReset callback
 * @returns Object containing confirmation state and handler functions
 *
 * @example
 * ```tsx
 * const { isConfirmOpen, openConfirmDialog, closeConfirmDialog, confirmReset } = useFormReset({
 *   onReset: () => form.reset()
 * });
 *
 * return (
 *   <>
 *     <button onClick={openConfirmDialog}>Reset Form</button>
 *     <ConfirmDialog
 *       open={isConfirmOpen}
 *       onCancel={closeConfirmDialog}
 *       onConfirm={confirmReset}
 *     />
 *   </>
 * );
 * ```
 */
export const useFormReset = (options: UseFormResetOptions): UseFormResetReturn => {
  const { onReset } = options;
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  /**
   * Opens the confirmation dialog
   */
  const openConfirmDialog = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  /**
   * Closes the confirmation dialog
   */
  const closeConfirmDialog = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  /**
   * Confirms the reset action by calling the onReset callback
   * and closing the confirmation dialog
   */
  const confirmReset = useCallback(() => {
    onReset();
    setIsConfirmOpen(false);
  }, [onReset]);

  return {
    isConfirmOpen,
    openConfirmDialog,
    closeConfirmDialog,
    confirmReset,
  };
};

export default useFormReset;
