/**
 * EmailGenerationForm Component
 *
 * A form component for generating recruitment emails with integrated validation.
 * Validates candidate data and job description before triggering email generation.
 */

import React, { useState } from 'react';
import { CandidateData, JobDescription } from '@recruit-flow/dto';
import { useEmailGenerationValidation } from '../hooks/useEmailGenerationValidation';
import { ValidationErrorDisplay } from './ValidationErrorDisplay';

/**
 * Props for the EmailGenerationForm component
 */
interface EmailGenerationFormProps {
  /** Partial candidate data to validate and use for email generation */
  candidateData: Partial<CandidateData> | null;
  /** Partial job description to validate and use for email generation */
  jobDescription: Partial<JobDescription> | null;
  /** Callback function to trigger email generation with validated data */
  onGenerate: (candidate: CandidateData, job: JobDescription) => Promise<void>;
}

/**
 * EmailGenerationForm - Form component with validation for generating recruitment emails
 *
 * Features:
 * - Validates candidate data and job description before generation
 * - Displays validation errors at both form and field level
 * - Shows loading state during generation
 * - Prevents submission when validation fails
 *
 * @param props - Component props
 * @returns React component
 */
export const EmailGenerationForm: React.FC<EmailGenerationFormProps> = ({
  candidateData,
  jobDescription,
  onGenerate,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { validationResult, validate, clearErrors, getFieldError } =
    useEmailGenerationValidation();

  /**
   * Handles the generate button click
   * Validates inputs before proceeding with generation
   */
  const handleGenerateClick = async () => {
    // Clear any previous errors before validation
    clearErrors();

    // Validate the current data
    const isValid = validate(candidateData, jobDescription);

    if (!isValid) {
      // Don't proceed with generation if validation fails
      return;
    }

    setIsGenerating(true);
    try {
      // Type assertion is safe here because validation passed
      await onGenerate(
        candidateData as CandidateData,
        jobDescription as JobDescription
      );
    } catch (error) {
      // Error handling is delegated to the parent component via onGenerate
      console.error('Email generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Get field-specific errors for display
  const candidateError = getFieldError('candidate');
  const jobDescriptionError = getFieldError('jobDescription');

  return (
    <div className="email-generation-form space-y-4">
      {/* Form-level validation errors */}
      {validationResult && !validationResult.isValid && (
        <ValidationErrorDisplay errors={validationResult.errors} />
      )}

      {/* Field-level error indicators */}
      {candidateError && (
        <p className="text-red-500 text-sm" role="alert">
          ⚠️ {candidateError}
        </p>
      )}
      {jobDescriptionError && (
        <p className="text-red-500 text-sm" role="alert">
          ⚠️ {jobDescriptionError}
        </p>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerateClick}
        disabled={isGenerating}
        aria-busy={isGenerating}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : 'Generate Email'}
      </button>
    </div>
  );
};

export default EmailGenerationForm;
