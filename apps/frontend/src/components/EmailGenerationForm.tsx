/**
 * EmailGenerationForm Component
 *
 * A form component that handles email generation with integrated validation.
 * Validates candidate data and job description before triggering email generation.
 */

import React, { useState } from 'react';
import { CandidateData, JobDescription } from '@repo/dto';
import { useEmailGenerationValidation } from '../hooks/useEmailGenerationValidation';
import { ValidationErrorDisplay } from './ValidationErrorDisplay';

/**
 * Props for the EmailGenerationForm component
 */
interface EmailGenerationFormProps {
  /** Candidate data to be used for email generation */
  candidateData: CandidateData | null;
  /** Job description to be used for email generation */
  jobDescription: JobDescription | null;
  /** Callback function to trigger email generation */
  onGenerateEmail: () => Promise<void>;
}

/**
 * EmailGenerationForm component with validation integration.
 *
 * This component provides a form interface for generating emails with:
 * - Input validation for candidate data and job description
 * - Loading state management during generation
 * - Error display for validation failures
 *
 * @param props - Component props
 * @returns React component
 */
export const EmailGenerationForm: React.FC<EmailGenerationFormProps> = ({
  candidateData,
  jobDescription,
  onGenerateEmail,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { validationErrors, validate, clearErrors } = useEmailGenerationValidation();

  /**
   * Handles the email generation process.
   * Validates inputs before triggering generation.
   */
  const handleGenerateEmail = async () => {
    // Clear any previous validation errors
    clearErrors();

    // Validate the input data
    const validationResult = validate({
      candidate: candidateData,
      jobDescription: jobDescription,
    });

    // Block email generation if validation fails
    if (!validationResult.isValid) {
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerateEmail();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="email-generation-form">
      <ValidationErrorDisplay
        errors={validationErrors}
        onDismiss={clearErrors}
      />

      <button
        onClick={handleGenerateEmail}
        disabled={isGenerating}
        aria-busy={isGenerating}
        aria-label={isGenerating ? 'Generating email...' : 'Generate email'}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 600,
          backgroundColor: isGenerating ? '#9ca3af' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease',
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate Email'}
      </button>
    </div>
  );
};

export default EmailGenerationForm;
