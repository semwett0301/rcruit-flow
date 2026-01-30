/**
 * SuccessMessage Component
 *
 * A reusable component for displaying success notifications with proper accessibility.
 * Features WCAG AA compliant colors, screen reader support, and smooth CSS transitions.
 */

import React from 'react';

export interface SuccessMessageProps {
  /** The title of the success message */
  title: string;
  /** The main message content */
  message: string;
  /** Optional next steps or additional information */
  nextSteps?: string;
  /** Optional callback when dismiss button is clicked */
  onDismiss?: () => void;
  /** Controls visibility of the component */
  visible: boolean;
}

/**
 * CheckmarkIcon - SVG checkmark icon for success indication
 */
const CheckmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
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
 * CloseIcon - SVG close/dismiss icon
 */
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
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
);

/**
 * SuccessMessage Component
 *
 * Displays a success notification with accessibility features including
 * role="alert" and aria-live="polite" for screen reader compatibility.
 *
 * @example
 * ```tsx
 * <SuccessMessage
 *   title="Success!"
 *   message="Your changes have been saved."
 *   nextSteps="You can now continue to the next step."
 *   onDismiss={() => setShowSuccess(false)}
 *   visible={showSuccess}
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
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className="success-message"
      style={styles.container}
    >
      <div style={styles.content}>
        <div style={styles.iconContainer}>
          <CheckmarkIcon className="success-message__icon" />
          <style>{iconStyles}</style>
        </div>
        <div style={styles.textContainer}>
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.message}>{message}</p>
          {nextSteps && (
            <p style={styles.nextSteps}>{nextSteps}</p>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            style={styles.dismissButton}
            aria-label="Dismiss success message"
            className="success-message__dismiss"
          >
            <CloseIcon className="success-message__close-icon" />
          </button>
        )}
      </div>
      <style>{animationStyles}</style>
    </div>
  );
};

/**
 * Inline styles for the component
 * Using WCAG AA compliant colors:
 * - Background: #d4edda (light green)
 * - Border: #28a745 (green)
 * - Text: #155724 (dark green) - contrast ratio > 4.5:1
 */
const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#d4edda',
    border: '1px solid #28a745',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    animation: 'successMessageFadeIn 0.3s ease-in-out',
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  iconContainer: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    color: '#28a745',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 600,
    color: '#155724',
    lineHeight: 1.4,
  },
  message: {
    margin: 0,
    fontSize: '14px',
    color: '#155724',
    lineHeight: 1.5,
  },
  nextSteps: {
    margin: '8px 0 0 0',
    fontSize: '13px',
    color: '#1e7e34',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
  dismissButton: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    padding: 0,
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: '#155724',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};

/**
 * CSS for icon sizing
 */
const iconStyles = `
  .success-message__icon {
    width: 24px;
    height: 24px;
  }
  .success-message__close-icon {
    width: 16px;
    height: 16px;
  }
  .success-message__dismiss:hover {
    background-color: rgba(21, 87, 36, 0.1);
  }
  .success-message__dismiss:focus {
    outline: 2px solid #155724;
    outline-offset: 2px;
  }
`;

/**
 * CSS animation for smooth appearance
 */
const animationStyles = `
  @keyframes successMessageFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default SuccessMessage;
