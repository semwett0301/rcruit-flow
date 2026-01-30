/**
 * SuccessMessage Component
 *
 * A reusable component for displaying success notifications with
 * accessibility support, smooth animations, and responsive design.
 */

import React from 'react';

/**
 * Props for the SuccessMessage component
 */
export interface SuccessMessageProps {
  /** The title of the success message */
  title: string;
  /** The main message content */
  message: string;
  /** Optional next steps or additional information */
  nextSteps?: string;
  /** Optional callback when the dismiss button is clicked */
  onDismiss?: () => void;
  /** Controls the visibility of the component */
  visible: boolean;
}

/**
 * CheckmarkIcon - SVG checkmark icon for success indication
 */
const CheckmarkIcon: React.FC = () => (
  <svg
    className="success-message__icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/**
 * SuccessMessage Component
 *
 * Displays a success notification with title, message, optional next steps,
 * and an optional dismiss button. Includes accessibility features and
 * smooth fade-in animation.
 *
 * @example
 * ```tsx
 * <SuccessMessage
 *   visible={true}
 *   title="Success!"
 *   message="Your changes have been saved."
 *   nextSteps="You can now continue to the next step."
 *   onDismiss={() => setShowSuccess(false)}
 * />
 * ```
 */
export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  nextSteps,
  onDismiss,
  visible,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="success-message"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <style>{`
        .success-message {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          background-color: #ecfdf5;
          border: 1px solid #10b981;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
          animation: successFadeIn 0.3s ease-out;
          max-width: 100%;
          box-sizing: border-box;
        }

        @keyframes successFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .success-message__icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          color: #10b981;
          margin-top: 2px;
        }

        .success-message__content {
          flex: 1;
          min-width: 0;
        }

        .success-message__title {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #065f46;
          line-height: 1.4;
        }

        .success-message__text {
          margin: 0;
          font-size: 14px;
          color: #047857;
          line-height: 1.5;
        }

        .success-message__next-steps {
          margin: 8px 0 0 0;
          padding-top: 8px;
          border-top: 1px solid #a7f3d0;
          font-size: 13px;
          color: #059669;
          line-height: 1.5;
        }

        .success-message__dismiss {
          flex-shrink: 0;
          padding: 4px;
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: #10b981;
          transition: background-color 0.2s ease, color 0.2s ease;
          line-height: 1;
        }

        .success-message__dismiss:hover {
          background-color: #d1fae5;
          color: #065f46;
        }

        .success-message__dismiss:focus {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }

        .success-message__dismiss:focus:not(:focus-visible) {
          outline: none;
        }

        .success-message__dismiss:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }

        .success-message__dismiss-icon {
          width: 20px;
          height: 20px;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .success-message {
            padding: 12px 16px;
            gap: 10px;
          }

          .success-message__icon {
            width: 20px;
            height: 20px;
          }

          .success-message__title {
            font-size: 15px;
          }

          .success-message__text {
            font-size: 13px;
          }

          .success-message__next-steps {
            font-size: 12px;
          }
        }
      `}</style>

      <CheckmarkIcon />

      <div className="success-message__content">
        <h3 className="success-message__title">{title}</h3>
        <p className="success-message__text">{message}</p>
        {nextSteps && (
          <p className="success-message__next-steps">{nextSteps}</p>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          className="success-message__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss success message"
        >
          <svg
            className="success-message__dismiss-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;
