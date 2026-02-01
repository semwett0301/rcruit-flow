/**
 * CvUploadError Component
 *
 * A reusable error display component for CV upload failures.
 * Displays user-friendly error messages with optional retry and support actions.
 */
import React from 'react';
import { UserFriendlyError } from '../../utils/cv-upload-error-messages';

/**
 * Props for the CvUploadError component
 */
interface CvUploadErrorProps {
  /** The error object containing title, message, and suggestion */
  error: UserFriendlyError;
  /** Optional callback for retry action */
  onRetry?: () => void;
  /** Optional callback for contact support action */
  onContactSupport?: () => void;
}

/**
 * Error display component for CV upload failures.
 *
 * Features:
 * - Accessible error alert with ARIA attributes
 * - Displays error title, message, and helpful suggestion
 * - Optional retry button
 * - Optional contact support button (shown based on error configuration)
 *
 * @example
 * ```tsx
 * <CvUploadError
 *   error={{
 *     title: "Upload Failed",
 *     message: "The file could not be uploaded.",
 *     suggestion: "Please try again with a smaller file.",
 *     showContactSupport: true
 *   }}
 *   onRetry={() => handleRetry()}
 *   onContactSupport={() => openSupportModal()}
 * />
 * ```
 */
export const CvUploadError: React.FC<CvUploadErrorProps> = ({
  error,
  onRetry,
  onContactSupport
}) => {
  return (
    <div className="cv-upload-error" role="alert" aria-live="polite">
      <div className="cv-upload-error__icon">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>
      <div className="cv-upload-error__content">
        <h3 className="cv-upload-error__title">{error.title}</h3>
        <p className="cv-upload-error__message">{error.message}</p>
        {error.suggestion && (
          <p className="cv-upload-error__suggestion">{error.suggestion}</p>
        )}
      </div>
      <div className="cv-upload-error__actions">
        {onRetry && (
          <button
            type="button"
            className="cv-upload-error__btn cv-upload-error__btn--primary"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
        {error.showContactSupport && onContactSupport && (
          <button
            type="button"
            className="cv-upload-error__btn cv-upload-error__btn--secondary"
            onClick={onContactSupport}
          >
            Contact Support
          </button>
        )}
      </div>
    </div>
  );
};

export default CvUploadError;
