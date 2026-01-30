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
  /** Function to manually reset the copied and error states */
  reset: () => void;
}

/**
 * Custom hook for clipboard operations with success/error state management.
 *
 * @param resetDelay - Time in milliseconds before the copied state resets to false (default: 2000ms)
 * @returns Object containing copied state, error state, copyToClipboard function, and reset function
 *
 * @example
 * ```tsx
 * const { copied, error, copyToClipboard } = useClipboard();
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
   * Resets both copied and error states to their initial values
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
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (!navigator.clipboard) {
        // Fallback for older browsers that don't support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        // Position off-screen to avoid visual disruption
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', ''); // Prevent mobile keyboard from opening
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } else {
        await navigator.clipboard.writeText(text);
      }

      setCopied(true);
      setError(null);

      // Auto-reset copied state after the specified delay
      setTimeout(() => setCopied(false), resetDelay);
    } catch (err) {
      setError('Failed to copy to clipboard. Please try again or copy manually.');
      setCopied(false);
    }
  }, [resetDelay]);

  return { copied, error, copyToClipboard, reset };
};

export default useClipboard;
