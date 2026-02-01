/**
 * CvUploadError Component
 *
 * A reusable error display component for CV upload failures.
 * Provides user-friendly error messages with appropriate actions
 * based on the error type (retry, contact support, dismiss).
 */
import React from 'react';
import { CvUploadErrorCode } from '@rcruit-flow/dto';
import {
  CV_UPLOAD_ERROR_MESSAGES,
  UserFriendlyError,
} from '../../constants/cv-upload-messages';
import './CvUploadError.css';

/**
 * Props for the CvUploadError component
 */
interface CvUploadErrorProps {
  /** The error code from the CV upload operation */
  errorCode: CvUploadErrorCode;
  /** Callback function when user clicks retry button */
  onRetry?: () => void;
  /** Callback function when user clicks contact support button */
  onContactSupport?: () => void;
  /** Optional error reference ID for support purposes */
  errorReference?: string;
}

/**
 * CvUploadError - Displays error information for CV upload failures
 *
 * Uses predefined error messages from CV_UPLOAD_ERROR_MESSAGES constant
 * to provide consistent, user-friendly error displays across the application.
 *
 * @example
 * ```tsx
 * <CvUploadError
 *   errorCode={CvUploadErrorCode.FILE_TOO_LARGE}
 *   onRetry={() => handleRetry()}
 *   onContactSupport={() => handleContactSupport()}
 *   errorReference="ERR-12345"
 * />
 * ```
 */
export const CvUploadError: React.FC<CvUploadErrorProps> = ({
  errorCode,
  onRetry,
  onContactSupport,
  errorReference,
}) => {
  // Get error info from predefined messages, fallback to unknown error
  const errorInfo: UserFriendlyError =
    CV_UPLOAD_ERROR_MESSAGES[errorCode] ||
    CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.UNKNOWN_ERROR];

  return (
    <div className="cv-upload-error" role="alert" aria-live="polite">
      <div className="cv-upload-error__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>

      <div className="cv-upload-error__content">
        <h3 className="cv-upload-error__title">{errorInfo.title}</h3>
        <p className="cv-upload-error__message">{errorInfo.message}</p>
        <p className="cv-upload-error__action">{errorInfo.action}</p>

        {errorReference && (
          <p className="cv-upload-error__reference">
            Reference: <code>{errorReference}</code>
          </p>
        )}
      </div>

      <div className="cv-upload-error__buttons">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="cv-upload-error__btn cv-upload-error__btn--primary"
          >
            Try Again
          </button>
        )}

        {onContactSupport && (
          <button
            type="button"
            onClick={onContactSupport}
            className="cv-upload-error__btn cv-upload-error__btn--secondary"
          >
            Contact Support
          </button>
        )}
      </div>
    </div>
  );
};

export default CvUploadError;
