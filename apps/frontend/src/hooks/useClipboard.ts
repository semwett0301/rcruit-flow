/**
 * Custom React hook for clipboard operations with success/error state management.
 * Provides a simple interface for copying text to clipboard with automatic
 * state reset and fallback support for older browsers.
 */

import { useState, useCallback } from 'react';

/**
 * Return type for the useClipboard hook
 */
interface UseClipboardReturn {
  /** Whether the copy operation was successful */
  copied: boolean;
  /** Error message if the copy operation failed, null otherwise */
  error: string | null;
  /** Function to copy text to clipboard */
  copyToClipboard: (text: string) => Promise<void>;
  /** Function to manually reset the copied/error state */
  reset: () => void;
}

/**
 * Custom hook for clipboard operations with success/error state management.
 *
 * @param resetDelay - Time in milliseconds before automatically resetting the copied state.
 *                     Set to 0 to disable auto-reset. Defaults to 2000ms.
 * @returns Object containing copied state, error state, copyToClipboard function, and reset function.
 *
 * @example
 * ```tsx
 * const { copied, error, copyToClipboard, reset } = useClipboard();
 *
 * const handleCopy = () => {
 *   copyToClipboard('Text to copy');
 * };
 *
 * return (
 *   <button onClick={handleCopy}>
 *     {copied ? 'Copied!' : 'Copy'}
 *   </button>
 * );
 * ```
 */
export const useClipboard = (resetDelay: number = 2000): UseClipboardReturn => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Resets the copied and error states to their initial values.
   */
  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  /**
   * Copies the provided text to the clipboard.
   * Uses the modern Clipboard API when available, with a fallback
   * to execCommand for older browsers.
   *
   * @param text - The text to copy to clipboard
   */
  const copyToClipboard = useCallback(
    async (text: string) => {
      if (!text) {
        setError('No text to copy');
        return;
      }

      try {
        if (navigator.clipboard && window.isSecureContext) {
          // Use modern Clipboard API when available
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers or non-secure contexts
          const textArea = document.createElement('textarea');
          textArea.value = text;
          // Position off-screen to avoid visual disruption
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          textArea.setAttribute('readonly', ''); // Prevent mobile keyboard from opening
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (!successful) {
            throw new Error('execCommand copy failed');
          }
        }

        setCopied(true);
        setError(null);

        // Auto-reset after delay if enabled
        if (resetDelay > 0) {
          setTimeout(reset, resetDelay);
        }
      } catch (err) {
        setError('Failed to copy to clipboard. Please try again or copy manually.');
        setCopied(false);
      }
    },
    [reset, resetDelay]
  );

  return { copied, error, copyToClipboard, reset };
};

export default useClipboard;
