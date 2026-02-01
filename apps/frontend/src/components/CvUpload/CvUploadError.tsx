/**
 * CvUploadError Component
 *
 * Displays user-friendly error messages for CV upload failures.
 * Provides clear feedback with title, message, and actionable suggestions.
 * Includes optional retry and dismiss actions for better user experience.
 */
import React from 'react';
import { UserFriendlyError } from '../../constants/cv-upload-messages';

/**
 * Props for the CvUploadError component
 */
interface CvUploadErrorProps {
  /** The error object containing title, message, and suggestion */
  error: UserFriendlyError;
  /** Optional callback to dismiss the error */
  onDismiss?: () => void;
  /** Optional callback to retry the failed operation */
  onRetry?: () => void;
}

/**
 * Error display component for CV upload failures.
 * Renders an accessible alert with error details and action buttons.
 *
 * @param props - Component props
 * @returns JSX element displaying the error
 */
export const CvUploadError: React.FC<CvUploadErrorProps> = ({
  error,
  onDismiss,
  onRetry,
}) => {
  return (
    <div className="cv-upload-error" role="alert" aria-live="polite">
      <div className="cv-upload-error__icon">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          width="24"
          height="24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>
      <div className="cv-upload-error__content">
        <h4 className="cv-upload-error__title">{error.title}</h4>
        <p className="cv-upload-error__message">{error.message}</p>
        {error.suggestion && (
          <p className="cv-upload-error__suggestion">
            <strong>What to do:</strong> {error.suggestion}
          </p>
        )}
      </div>
      <div className="cv-upload-error__actions">
        {onRetry && (
          <button
            type="button"
            className="cv-upload-error__retry-btn"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="cv-upload-error__dismiss-btn"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default CvUploadError;
