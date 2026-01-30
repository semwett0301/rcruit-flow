/**
 * CopyButton Component
 *
 * A reusable button component that copies text to the clipboard
 * with visual feedback states for success, error, and disabled states.
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
  /** Accessible label for the button */
  label?: string;
}

/**
 * CopyButton - A button component that copies text to clipboard with visual feedback
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <CopyButton text="Hello, World!" label="Copy greeting" />
 * ```
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  disabled = false,
  className = '',
  label = 'Copy to clipboard',
}) => {
  const { copied, error, copyToClipboard } = useClipboard();

  /**
   * Handles the button click event
   * Copies the text to clipboard if not disabled and text is provided
   */
  const handleClick = async (): Promise<void> => {
    if (!disabled && text) {
      await copyToClipboard(text);
    }
  };

  // Determine the button label based on current state
  const buttonLabel = copied ? 'Copied!' : error ? 'Failed' : label;

  // Build the CSS class string based on component state
  const buttonClass = [
    'copy-button',
    copied && 'copy-button--success',
    error && 'copy-button--error',
    disabled && 'copy-button--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="copy-button-container">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={buttonClass}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        {copied ? (
          <span className="copy-button__icon" aria-hidden="true">
            ✓
          </span>
        ) : (
          <span className="copy-button__icon" aria-hidden="true">
            📋
          </span>
        )}
        <span className="copy-button__text">{buttonLabel}</span>
      </button>
      {error && (
        <span className="copy-button__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default CopyButton;
