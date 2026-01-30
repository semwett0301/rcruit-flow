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
  ],
}) => {
  return (
    <div className="upload-success-message" role="alert" aria-live="polite">
      <div className="upload-success-message__icon">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          width="48"
          height="48"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>

      <h3 className="upload-success-message__title">Upload Successful!</h3>

      <p className="upload-success-message__text">
        {fileName
          ? `Your CV "${fileName}" has been`
          : 'Your CV has been'}{' '}
        received and processed successfully.
      </p>

      {nextSteps.length > 0 && (
        <div className="upload-success-message__next-steps">
          <h4>What happens next:</h4>
          <ul>
            {nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      {onDismiss && (
        <button
          className="upload-success-message__dismiss"
          onClick={onDismiss}
          type="button"
        >
          Got it
        </button>
      )}
    </div>
  );
};

export default UploadSuccessMessage;
