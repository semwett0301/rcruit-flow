/**
 * UploadSuccessMessage Component
 *
 * A reusable success message component for CV upload confirmation.
 * Displays a success icon, confirmation message, optional file name,
 * next steps information, and an optional dismiss button.
 */
import React from 'react';

export interface UploadSuccessMessageProps {
  /** The name of the uploaded file to display in the message */
  fileName?: string;
  /** Callback function when the dismiss button is clicked */
  onDismiss?: () => void;
  /** List of next steps to display to the user */
  nextSteps?: string[];
}

/**
 * UploadSuccessMessage displays a confirmation message after successful CV upload.
 *
 * @param props - Component props
 * @param props.fileName - Optional name of the uploaded file
 * @param props.onDismiss - Optional callback for dismiss button
 * @param props.nextSteps - Optional array of next step messages
 *
 * @example
 * ```tsx
 * <UploadSuccessMessage
 *   fileName="resume.pdf"
 *   onDismiss={() => setShowSuccess(false)}
 *   nextSteps={['Your CV will be reviewed', 'Expect a response within 24 hours']}
 * />
 * ```
 */
export const UploadSuccessMessage: React.FC<UploadSuccessMessageProps> = ({
  fileName,
  onDismiss,
  nextSteps = [
    'Your CV will be reviewed by our team',
    'You will receive an email confirmation shortly',
    'We will contact you if your profile matches our requirements',
  ],
}) => {
  return (
    <div className="upload-success-message" role="alert" aria-live="polite">
      <div className="upload-success-message__icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          width="48"
          height="48"
          aria-hidden="true"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <div className="upload-success-message__content">
        <h3 className="upload-success-message__title">Upload Successful!</h3>

        <p className="upload-success-message__text">
          {fileName
            ? `Your CV "${fileName}" has been`
            : 'Your CV has been'}{' '}
          successfully received and processed.
        </p>

        {nextSteps.length > 0 && (
          <div className="upload-success-message__next-steps">
            <p className="upload-success-message__next-steps-title">
              What happens next:
            </p>
            <ul>
              {nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          className="upload-success-message__dismiss"
          onClick={onDismiss}
          type="button"
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default UploadSuccessMessage;
