/**
 * UploadSuccessMessage Component
 *
 * A reusable success message component for CV upload confirmation.
 * Displays a success message with optional file name, next steps,
 * processing pending state, and dismiss functionality.
 */

import React from 'react';
import styles from './UploadSuccessMessage.module.css';

/**
 * Props interface for the UploadSuccessMessage component
 */
export interface UploadSuccessMessageProps {
  /** Optional name of the uploaded file to display */
  fileName?: string;
  /** Optional callback function when message is dismissed */
  onDismiss?: () => void;
  /** Whether to show the next steps section */
  showNextSteps?: boolean;
  /** Whether to show the processing pending message */
  processingPending?: boolean;
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
 *   fileName="resume.pdf"
 *   onDismiss={() => console.log('dismissed')}
 *   showNextSteps={true}
 *   processingPending={false}
 * />
 * ```
 */
export const UploadSuccessMessage: React.FC<UploadSuccessMessageProps> = ({
  fileName,
  onDismiss,
  showNextSteps = false,
  processingPending = false,
}) => {
  /**
   * Handle dismiss action
   */
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div
      className={styles.container}
      role="alert"
      aria-live="assertive"
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

        {processingPending && (
          <p className={styles.processingMessage}>
            Your file is being processed. This may take a few moments.
          </p>
        )}

        {showNextSteps && (
          <div className={styles.nextStepsContainer}>
            <h4 className={styles.nextStepsTitle}>What happens next:</h4>
            <p className={styles.nextStepsText}>
              Our team will review your CV and get back to you shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSuccessMessage;
