/**
 * CvUploadError Component
 * 
 * A reusable error display component for CV upload failures.
 * Displays user-friendly error messages with optional retry and support actions.
 * Implements accessible styling with ARIA attributes for screen readers.
 */
import React from 'react';
import { CvUploadErrorCode } from '@rcruit-flow/dto';
import { getCvUploadErrorMessage, UserFriendlyError } from '../../utils/cv-upload-error-messages';
import './CvUploadError.css';

interface CvUploadErrorProps {
  /** The error code returned from the CV upload operation */
  errorCode: CvUploadErrorCode;
  /** Optional callback function to retry the upload */
  onRetry?: () => void;
  /** Optional callback function to contact support */
  onContactSupport?: () => void;
}

/** Error codes that should show the retry button */
const RETRYABLE_ERROR_CODES: CvUploadErrorCode[] = [
  CvUploadErrorCode.SERVER_ERROR,
  CvUploadErrorCode.NETWORK_TIMEOUT,
  CvUploadErrorCode.UNKNOWN_ERROR,
];

/**
 * Displays a user-friendly error message for CV upload failures.
 * 
 * Features:
 * - Accessible error display with ARIA live region
 * - Configurable retry and support action buttons
 * - Retry button only shown for transient/retryable errors
 * - Graceful fallback for unknown error codes
 * 
 * @param errorCode - The specific error code from the upload attempt
 * @param onRetry - Optional handler for retry button click
 * @param onContactSupport - Optional handler for contact support button click
 * 
 * @example
 * ```tsx
 * <CvUploadError
 *   errorCode={CvUploadErrorCode.FILE_TOO_LARGE}
 *   onRetry={() => handleRetry()}
 *   onContactSupport={() => openSupportModal()}
 * />
 * ```
 */
export const CvUploadError: React.FC<CvUploadErrorProps> = ({
  errorCode,
  onRetry,
  onContactSupport,
}) => {
  const error: UserFriendlyError = getCvUploadErrorMessage(errorCode);
  
  // Only show retry button for transient errors that might succeed on retry
  const showRetry = RETRYABLE_ERROR_CODES.includes(errorCode) && onRetry;
  const hasActions = showRetry || onContactSupport;

  return (
    <div 
      className="cv-upload-error" 
      role="alert" 
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="cv-upload-error__icon" aria-hidden="true">
        ⚠️
      </div>
      <h3 className="cv-upload-error__title">
        {error.title}
      </h3>
      <p className="cv-upload-error__message">
        {error.message}
      </p>
      <p className="cv-upload-error__action">
        {error.action}
      </p>
      {hasActions && (
        <div className="cv-upload-error__buttons">
          {showRetry && (
            <button 
              className="cv-upload-error__btn cv-upload-error__btn--primary"
              onClick={onRetry}
              type="button"
              aria-label="Try uploading again"
            >
              Try Again
            </button>
          )}
          {onContactSupport && (
            <button 
              className="cv-upload-error__btn cv-upload-error__btn--secondary"
              onClick={onContactSupport}
              type="button"
              aria-label="Contact support for help"
            >
              Contact Support
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CvUploadError;
