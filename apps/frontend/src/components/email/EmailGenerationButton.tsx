/**
 * EmailGenerationButton Component
 *
 * A button component for triggering email generation with integrated loading state.
 * Displays a loading spinner and "Generating..." text when in loading state.
 */
import React from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface EmailGenerationButtonProps {
  /** Click handler for the button */
  onClick: () => void;
  /** Whether the button is in loading state */
  isLoading: boolean;
  /** Whether the button is disabled (independent of loading state) */
  disabled?: boolean;
  /** Additional CSS classes to apply */
  className?: string;
  /** Custom button content (defaults to "Generate Email") */
  children?: React.ReactNode;
}

export const EmailGenerationButton: React.FC<EmailGenerationButtonProps> = ({
  onClick,
  isLoading,
  disabled = false,
  className = '',
  children = 'Generate Email',
}) => {
  // Button is disabled when explicitly disabled or when loading
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative flex items-center justify-center gap-2 px-4 py-2
        bg-blue-500 text-white rounded-md
        hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>Generating...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default EmailGenerationButton;
