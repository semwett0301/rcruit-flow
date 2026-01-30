/**
 * EmailGenerationForm Component
 * 
 * A form component for generating recruitment emails with integrated validation.
 * Validates candidate data and job description before triggering email generation.
 */

import React, { useState } from 'react';
import { useEmailGenerationValidation } from '../hooks/useEmailGenerationValidation';
import { ValidationErrorDisplay } from './ValidationErrorDisplay';
import { CandidateData, JobDescription } from '@rcruit-flow/dto';

/**
 * Props for the EmailGenerationForm component
 */
interface EmailGenerationFormProps {
  /** Partial candidate data to validate and use for email generation */
  candidateData: Partial<CandidateData> | null;
  /** Partial job description to validate and use for email generation */
  jobDescription: Partial<JobDescription> | null;
  /** Callback function to trigger email generation */
  onGenerate: () => Promise<void>;
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
  onGenerate
}) => {
  const { errors, isValid, validate, clearErrors, getFieldError } = useEmailGenerationValidation();
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Handles the generate button click
   * Validates inputs before proceeding with generation
   */
  const handleGenerateClick = async () => {
    // Clear any previous errors before validation
    clearErrors();
    
    // Validate the current data
    const validationResult = validate(candidateData, jobDescription);
    
    if (!validationResult.isValid) {
      // Don't proceed with generation if validation fails
      return;
    }
    
    setIsGenerating(true);
    try {
      await onGenerate();
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
      <ValidationErrorDisplay errors={errors} className="mb-4" />
      
      {/* Field-level error indicators */}
      {candidateError && (
        <p className="text-red-500 text-sm" role="alert">
          ⚠️ Candidate information is missing
        </p>
      )}
      {jobDescriptionError && (
        <p className="text-red-500 text-sm" role="alert">
          ⚠️ Job description is missing
        </p>
      )}
      
      {/* Generate button */}
      <button
        onClick={handleGenerateClick}
        disabled={isGenerating}
        aria-busy={isGenerating}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          isGenerating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isGenerating ? 'Generating...' : 'Generate Email'}
      </button>
    </div>
  );
};

export default EmailGenerationForm;
