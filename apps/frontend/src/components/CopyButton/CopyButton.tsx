/**
 * CopyButton Component
 *
 * A reusable button component that copies text to the clipboard
 * with visual feedback states for success, error, and default states.
 */
import React from 'react';
import { useClipboard } from '../../hooks/useClipboard';
import './CopyButton.css';

/**
 * Props for the CopyButton component
 */
interface CopyButtonProps {
  /** The text content to copy to clipboard */
  text: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Label shown in default state */
  label?: string;
  /** Label shown after successful copy */
  successLabel?: string;
  /** Label shown when copy fails */
  errorLabel?: string;
}

/**
 * CopyButton - A button component with clipboard functionality and visual feedback
 *
 * @example
 * ```tsx
 * <CopyButton text="Hello, World!" />
 * <CopyButton text={code} label="Copy Code" successLabel="Code Copied!" />
 * ```
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  disabled = false,
  className = '',
  label = 'Copy to Clipboard',
  successLabel = 'Copied!',
  errorLabel = 'Failed to copy',
}) => {
  const { copied, error, copyToClipboard } = useClipboard(2000);

  /**
   * Handles the button click event
   * Copies the text to clipboard if not disabled and text is provided
   */
  const handleClick = async () => {
    if (!disabled && text) {
      await copyToClipboard(text);
    }
  };

  // Determine button state
  const isDisabled = disabled || !text;
  const buttonLabel = error ? errorLabel : copied ? successLabel : label;
  const buttonState = error ? 'error' : copied ? 'success' : 'default';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`copy-button copy-button--${buttonState} ${className}`.trim()}
      aria-label={buttonLabel}
      title={buttonLabel}
    >
      <span className="copy-button__icon">
        {copied ? (
          // Checkmark icon for success state
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          // Copy icon for default/error state
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        )}
      </span>
      <span className="copy-button__label">{buttonLabel}</span>
    </button>
  );
};

export default CopyButton;
