/**
 * EmailGenerationButton Component
 * 
 * A button component that handles email generation with integrated validation.
 * Validates candidate data and job description before triggering the generation process.
 */
import React, { useCallback } from 'react';
import { EmailGenerationInput } from '@repo/dto';
import { useEmailGenerationValidation } from '../hooks/useEmailGenerationValidation';
import { ValidationErrorAlert } from './ValidationErrorAlert';

interface EmailGenerationButtonProps {
  /** Candidate information for email generation */
  candidateData: EmailGenerationInput['candidateData'];
  /** Job description text */
  jobDescription: EmailGenerationInput['jobDescription'];
  /** Callback function triggered when validation passes and generation should start */
  onGenerate: () => void;
  /** Loading state indicator */
  isLoading?: boolean;
}

/**
 * EmailGenerationButton - Renders a button with validation for email generation
 * 
 * Features:
 * - Validates input data before triggering generation
 * - Displays validation errors via ValidationErrorAlert
 * - Shows loading state during generation
 * - Provides visual hints when required data is missing
 */
export const EmailGenerationButton: React.FC<EmailGenerationButtonProps> = ({
  candidateData,
  jobDescription,
  onGenerate,
  isLoading = false,
}) => {
  const { validationResult, validate, clearErrors, isValid } = useEmailGenerationValidation();

  /**
   * Handles button click - validates input and triggers generation if valid
   */
  const handleClick = useCallback(() => {
    const result = validate({ candidateData, jobDescription });
    if (result.isValid) {
      onGenerate();
    }
  }, [candidateData, jobDescription, validate, onGenerate]);

  // Check if button should show warning state (basic check for empty required fields)
  const hasRequiredData = Boolean(
    candidateData?.name && 
    candidateData?.email && 
    jobDescription?.trim()
  );

  return (
    <div className="email-generation-container">
      <ValidationErrorAlert 
        errors={validationResult.errors} 
        onDismiss={clearErrors} 
      />
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`email-generation-button ${!hasRequiredData ? 'button-warning' : ''}`}
        aria-describedby={!isValid ? 'validation-errors' : undefined}
        type="button"
      >
        {isLoading ? 'Generating...' : 'Generate Email'}
      </button>
      {!hasRequiredData && validationResult.errors.length === 0 && (
        <p className="validation-hint">
          Please fill in candidate data and job description to generate email
        </p>
      )}
    </div>
  );
};

export default EmailGenerationButton;
