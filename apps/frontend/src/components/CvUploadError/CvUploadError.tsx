/**
 * CvUploadError Component
 * 
 * A reusable error display component for CV upload failures.
 * Displays user-friendly error messages with optional retry and support actions.
 * Implements accessible styling with ARIA attributes for screen readers.
 */
import React from 'react';
import { CvUploadErrorCode } from '@rcruit-flow/dto';
import { CV_UPLOAD_ERROR_MESSAGES, UserFriendlyError } from '../../constants/cv-upload-messages';
import './CvUploadError.css';

interface CvUploadErrorProps {
  /** The error code returned from the CV upload operation */
  errorCode: CvUploadErrorCode;
  /** Optional callback function to retry the upload */
  onRetry?: () => void;
  /** Optional callback function to contact support */
  onContactSupport?: () => void;
}

/**
 * Displays a user-friendly error message for CV upload failures.
 * 
 * Features:
 * - Accessible error display with ARIA live region
 * - Configurable retry and support action buttons
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
  onContactSupport
}) => {
  // Get error info from messages map, fallback to unknown error if code not found
  const errorInfo: UserFriendlyError = 
    CV_UPLOAD_ERROR_MESSAGES[errorCode] || 
    CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.UNKNOWN_ERROR];

  const hasActions = onRetry || onContactSupport;

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
        {errorInfo.title}
      </h3>
      <p className="cv-upload-error__message">
        {errorInfo.message}
      </p>
      <p className="cv-upload-error__action">
        {errorInfo.action}
      </p>
      {hasActions && (
        <div className="cv-upload-error__buttons">
          {onRetry && (
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
