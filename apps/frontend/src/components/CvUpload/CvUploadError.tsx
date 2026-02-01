/**
 * CvUploadError Component
 *
 * Displays user-friendly error messages for CV upload failures.
 * Provides clear feedback with title, message, and actionable suggestions.
 * Includes optional retry and dismiss actions for better user experience.
 */
import React from 'react';
import { UserFriendlyError, SUPPORT_EMAIL } from '../../constants/cvUploadErrors';

/**
 * Props for the CvUploadError component
 */
interface CvUploadErrorProps {
  /** The error object containing title, message, suggestions, and flags */
  error: UserFriendlyError;
  /** Optional callback to retry the failed operation */
  onRetry?: () => void;
  /** Optional callback to dismiss the error */
  onDismiss?: () => void;
}

/**
 * Error display component for CV upload failures.
 * Renders an accessible alert with error details, suggestions, and action buttons.
 *
 * @param props - Component props
 * @returns JSX element displaying the error
 */
export const CvUploadError: React.FC<CvUploadErrorProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="cv-upload-error" role="alert" aria-live="polite">
      <div className="cv-upload-error__header">
        <span className="cv-upload-error__icon" aria-hidden="true">
          ⚠️
        </span>
        <h3 className="cv-upload-error__title">{error.title}</h3>
      </div>

      <p className="cv-upload-error__message">{error.message}</p>

      <div className="cv-upload-error__suggestions">
        <p className="cv-upload-error__suggestions-label">What you can do:</p>
        <ul className="cv-upload-error__suggestions-list">
          {error.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>

      <div className="cv-upload-error__actions">
        {error.canRetry && onRetry && (
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
          >
            Dismiss
          </button>
        )}
      </div>

      {error.showContactSupport && (
        <div className="cv-upload-error__support">
          <p>
            Still having trouble?{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>Contact Support</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default CvUploadError;
