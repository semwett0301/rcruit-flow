/**
 * UploadSuccessMessage Component
 *
 * A reusable success message component for CV upload confirmation.
 * Displays a success message with optional file name, next steps, and dismiss functionality.
 */

import React, { useEffect, useCallback } from 'react';
import styles from './UploadSuccessMessage.module.css';

/**
 * Props interface for the UploadSuccessMessage component
 */
export interface UploadSuccessMessageProps {
  /** Controls visibility of the success message */
  isVisible: boolean;
  /** Optional name of the uploaded file to display */
  fileName?: string;
  /** Optional callback function when message is dismissed */
  onDismiss?: () => void;
  /** Optional list of next steps to display to the user */
  nextSteps?: string[];
  /** Optional auto-dismiss timeout in milliseconds (default: no auto-dismiss) */
  autoDismissTimeout?: number;
}

/**
 * Checkmark icon component for success indication
 */
const CheckmarkIcon: React.FC = () => (
  <svg
    className={styles.checkmarkIcon}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Close icon component for dismiss button
 */
const CloseIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    width="16"
    height="16"
  >
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * UploadSuccessMessage - Displays a success message after CV upload
 *
 * @example
 * ```tsx
 * <UploadSuccessMessage
 *   isVisible={showSuccess}
 *   fileName="resume.pdf"
 *   onDismiss={() => setShowSuccess(false)}
 *   nextSteps={[
 *     "We'll review your CV shortly",
 *     "You'll receive an email confirmation"
 *   ]}
 *   autoDismissTimeout={5000}
 * />
 * ```
 */
export const UploadSuccessMessage: React.FC<UploadSuccessMessageProps> = ({
  isVisible,
  fileName,
  onDismiss,
  nextSteps,
  autoDismissTimeout,
}) => {
  /**
   * Handle dismiss action
   */
  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  /**
   * Auto-dismiss effect
   */
  useEffect(() => {
    if (isVisible && autoDismissTimeout && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismissTimeout);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoDismissTimeout, onDismiss]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={styles.container}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <CheckmarkIcon />
          <h3 className={styles.title}>Your CV has been uploaded successfully!</h3>
          {onDismiss && (
            <button
              type="button"
              className={styles.dismissButton}
              onClick={handleDismiss}
              aria-label="Dismiss success message"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {fileName && (
          <p className={styles.fileName}>
            <span className={styles.fileLabel}>File:</span> {fileName}
          </p>
        )}

        {nextSteps && nextSteps.length > 0 && (
          <div className={styles.nextStepsContainer}>
            <h4 className={styles.nextStepsTitle}>What happens next:</h4>
            <ul className={styles.nextStepsList}>
              {nextSteps.map((step, index) => (
                <li key={index} className={styles.nextStepItem}>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSuccessMessage;
