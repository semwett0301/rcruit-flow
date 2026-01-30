/**
 * CvUploadError Component
 *
 * A reusable error display component for CV upload failures.
 * Displays error information with optional retry and dismiss actions,
 * and support contact information for critical errors.
 */
import React from 'react';
import { CvUploadErrorCode } from '@rcruit-flow/dto';
import {
  CV_UPLOAD_ERROR_MESSAGES,
  SUPPORT_CONTACT,
} from '../../constants/cv-upload-messages';
import './CvUploadError.css';

export interface CvUploadErrorProps {
  /** The error code indicating the type of upload failure */
  errorCode: CvUploadErrorCode;
  /** Optional callback function triggered when user clicks retry */
  onRetry?: () => void;
  /** Optional callback function triggered when user dismisses the error */
  onDismiss?: () => void;
  /** Whether to show support contact link for critical errors (default: true) */
  showSupportLink?: boolean;
}

/**
 * Determines if support contact information should be displayed
 * based on the error code type.
 */
const shouldShowSupportContact = (errorCode: CvUploadErrorCode): boolean => {
  const criticalErrors: CvUploadErrorCode[] = [
    CvUploadErrorCode.SERVER_ERROR,
    CvUploadErrorCode.UNKNOWN_ERROR,
    CvUploadErrorCode.FILE_CORRUPTED,
  ];
  return criticalErrors.includes(errorCode);
};

/**
 * CvUploadError displays user-friendly error messages for CV upload failures.
 *
 * Features:
 * - Displays error title, message, and suggested action
 * - Optional retry and dismiss buttons
 * - Support contact information for critical errors
 * - Accessible with ARIA attributes for screen readers
 *
 * @example
 * ```tsx
 * <CvUploadError
 *   errorCode={CvUploadErrorCode.FILE_TOO_LARGE}
 *   onRetry={() => handleRetry()}
 *   onDismiss={() => setError(null)}
 * />
 * ```
 */
export const CvUploadError: React.FC<CvUploadErrorProps> = ({
  errorCode,
  onRetry,
  onDismiss,
  showSupportLink = true,
}) => {
  const errorInfo = CV_UPLOAD_ERROR_MESSAGES[errorCode];
  const showSupport = showSupportLink && shouldShowSupportContact(errorCode);

  // Handle case where error code is not found in messages
  if (!errorInfo) {
    console.warn(`Unknown error code: ${errorCode}`);
    return null;
  }

  return (
    <div className="cv-upload-error" role="alert" aria-live="polite">
      <div className="cv-upload-error__icon" aria-hidden="true">
        ⚠️
      </div>
      <div className="cv-upload-error__content">
        <h4 className="cv-upload-error__title">{errorInfo.title}</h4>
        <p className="cv-upload-error__message">{errorInfo.message}</p>
        <p className="cv-upload-error__action">{errorInfo.action}</p>
        {showSupport && (
          <p className="cv-upload-error__support">
            {SUPPORT_CONTACT.message}{' '}
            <a
              href={`mailto:${SUPPORT_CONTACT.email}`}
              className="cv-upload-error__support-link"
            >
              {SUPPORT_CONTACT.email}
            </a>
          </p>
        )}
      </div>
      <div className="cv-upload-error__actions">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="cv-upload-error__btn cv-upload-error__btn--retry"
          >
            Try Again
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="cv-upload-error__btn cv-upload-error__btn--dismiss"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default CvUploadError;
