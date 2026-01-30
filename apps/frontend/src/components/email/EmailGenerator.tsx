/**
 * EmailGenerator Component
 *
 * A complete email generator component that combines the email generation button,
 * status display, and the useEmailGeneration hook to provide a unified interface
 * for generating emails.
 */

import React from 'react';
import { useEmailGeneration } from '../../hooks/useEmailGeneration';
import { EmailGenerationButton } from './EmailGenerationButton';
import { EmailGenerationStatus } from './EmailGenerationStatus';

/**
 * Props for the EmailGenerator component
 */
interface EmailGeneratorProps {
  /** Optional candidate ID to generate email for */
  candidateId?: string;
  /** Optional template ID to use for email generation */
  templateId?: string;
  /** Callback fired when email is successfully generated */
  onEmailGenerated?: (email: any) => void;
}

/**
 * EmailGenerator component that provides a complete UI for generating emails.
 * Combines the generation button with status display and handles all state management.
 *
 * @param props - Component props
 * @returns The rendered EmailGenerator component
 *
 * @example
 * ```tsx
 * <EmailGenerator
 *   candidateId="123"
 *   templateId="welcome-template"
 *   onEmailGenerated={(email) => console.log('Generated:', email)}
 * />
 * ```
 */
export const EmailGenerator: React.FC<EmailGeneratorProps> = ({
  candidateId,
  templateId,
  onEmailGenerated,
}) => {
  const { isLoading, error, generateEmail, clearError } = useEmailGeneration({
    onSuccess: onEmailGenerated,
    onError: (err) => console.error('Email generation error:', err),
  });

  /**
   * Handles the email generation request
   */
  const handleGenerateEmail = () => {
    generateEmail({ candidateId, templateId });
  };

  return (
    <div className="space-y-4">
      <EmailGenerationButton
        onClick={handleGenerateEmail}
        isLoading={isLoading}
      />
      <EmailGenerationStatus
        isLoading={isLoading}
        error={error}
        onDismissError={clearError}
      />
    </div>
  );
};

export default EmailGenerator;
