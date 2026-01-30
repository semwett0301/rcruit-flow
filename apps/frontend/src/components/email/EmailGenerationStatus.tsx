/**
 * EmailGenerationStatus Component
 *
 * A status component that displays loading state, success, and error messages
 * for email generation operations. Provides visual feedback to users during
 * async email generation processes.
 */

import React from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';

/**
 * Props for the EmailGenerationStatus component
 */
interface EmailGenerationStatusProps {
  /** Whether the email generation is currently in progress */
  isLoading: boolean;
  /** Error object if email generation failed, null otherwise */
  error: Error | null;
  /** Optional callback to dismiss the error message */
  onDismissError?: () => void;
}

/**
 * Displays the current status of email generation operations.
 *
 * Shows a loading indicator when generation is in progress,
 * an error message with optional dismiss button when generation fails,
 * or nothing when idle/successful.
 *
 * @param props - Component props
 * @returns Status display component or null when idle
 *
 * @example
 * ```tsx
 * <EmailGenerationStatus
 *   isLoading={isGenerating}
 *   error={generationError}
 *   onDismissError={() => setGenerationError(null)}
 * />
 * ```
 */
export const EmailGenerationStatus: React.FC<EmailGenerationStatusProps> = ({
  isLoading,
  error,
  onDismissError,
}) => {
  // Display loading state
  if (isLoading) {
    return (
      <div
        className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-md"
        role="status"
        aria-live="polite"
      >
        <LoadingSpinner size="md" />
        <div>
          <p className="font-medium text-blue-800">Generating email...</p>
          <p className="text-sm text-blue-600">This may take a few moments</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div
        className="flex items-start justify-between p-4 bg-red-50 border border-red-200 rounded-md"
        role="alert"
        aria-live="assertive"
      >
        <div>
          <p className="font-medium text-red-800">Email generation failed</p>
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
        {onDismissError && (
          <button
            onClick={onDismissError}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Dismiss error"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  // Return null when idle (no loading, no error)
  return null;
};

export default EmailGenerationStatus;
