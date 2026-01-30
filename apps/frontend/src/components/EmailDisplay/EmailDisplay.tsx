/**
 * EmailDisplay Component
 *
 * Displays the generated email content with a copy button.
 * Handles loading, empty, and content states.
 */
import React from 'react';
import { CopyButton } from '../CopyButton';
import './EmailDisplay.css';

interface EmailDisplayProps {
  /** The generated email content to display */
  emailContent: string | null;
  /** Whether the email is currently being generated */
  isLoading?: boolean;
}

/**
 * Component for displaying generated email content with copy functionality.
 *
 * @param emailContent - The email text to display
 * @param isLoading - Shows loading state when true
 */
export const EmailDisplay: React.FC<EmailDisplayProps> = ({
  emailContent,
  isLoading = false,
}) => {
  const hasEmail = Boolean(emailContent && emailContent.trim());

  // Loading state
  if (isLoading) {
    return (
      <div className="email-display email-display--loading">
        <div className="email-display__spinner">Generating email...</div>
      </div>
    );
  }

  // Empty state - no email generated yet
  if (!hasEmail) {
    return (
      <div className="email-display email-display--empty">
        <p>No email generated yet. Fill in the form and click generate.</p>
      </div>
    );
  }

  // Content state - display email with copy button
  return (
    <div className="email-display">
      <div className="email-display__header">
        <h3 className="email-display__title">Generated Email</h3>
        <CopyButton
          text={emailContent || ''}
          disabled={!hasEmail}
          label="Copy Email"
          successLabel="Email Copied!"
        />
      </div>
      <div className="email-display__content">
        <pre className="email-display__text">{emailContent}</pre>
      </div>
    </div>
  );
};

export default EmailDisplay;
