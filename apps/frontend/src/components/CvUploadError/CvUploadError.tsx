/**
 * CvUploadError Component
 *
 * A reusable error display component for CV upload failures.
 * Provides user-friendly error messages with appropriate actions
 * based on the error type (retry, contact support, dismiss).
 */
import React from 'react';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

/**
 * Props for the CvUploadError component
 */
interface CvUploadErrorProps {
  /** The error title to display */
  title: string;
  /** Detailed error message explaining what went wrong */
  message: string;
  /** Suggested action for the user to take */
  action: string;
  /** Optional error code to determine if retry is available */
  code?: CvUploadErrorCode | null;
  /** Callback function when user clicks retry button */
  onRetry?: () => void;
  /** Callback function when user dismisses the error */
  onDismiss?: () => void;
  /** Whether to show the contact support link */
  showContactSupport?: boolean;
}

/**
 * Error codes that allow retry functionality
 */
const RETRYABLE_ERROR_CODES: CvUploadErrorCode[] = [
  CvUploadErrorCode.SERVER_ERROR,
  CvUploadErrorCode.NETWORK_ERROR,
  CvUploadErrorCode.UPLOAD_TIMEOUT,
];

/**
 * Determines if an error code is retryable
 */
const isRetryableError = (code?: CvUploadErrorCode | null): boolean => {
  if (!code) return false;
  return RETRYABLE_ERROR_CODES.includes(code);
};

/**
 * CvUploadError - Displays error information for CV upload failures
 *
 * @example
 * ```tsx
 * <CvUploadError
 *   title="Upload Failed"
 *   message="The file could not be uploaded due to a network error."
 *   action="Please check your connection and try again."
 *   code={CvUploadErrorCode.NETWORK_ERROR}
 *   onRetry={() => handleRetry()}
 *   onDismiss={() => handleDismiss()}
 * />
 * ```
 */
export const CvUploadError: React.FC<CvUploadErrorProps> = ({
  title,
  message,
  action,
  code,
  onRetry,
  onDismiss,
  showContactSupport = false,
}) => {
  const canRetry = isRetryableError(code) && typeof onRetry === 'function';

  return (
    <div className="cv-upload-error" role="alert" aria-live="polite">
      <div className="cv-upload-error__icon" aria-hidden="true">
        {/* Error icon */}
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>

      <div className="cv-upload-error__content">
        <h3 className="cv-upload-error__title">{title}</h3>
        <p className="cv-upload-error__message">{message}</p>
        <p className="cv-upload-error__action">{action}</p>
      </div>

      <div className="cv-upload-error__actions">
        {canRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="cv-upload-error__retry-btn"
          >
            Try Again
          </button>
        )}

        {showContactSupport && (
          <a href="/support" className="cv-upload-error__support-link">
            Contact Support
          </a>
        )}

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="cv-upload-error__dismiss-btn"
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
