import React, { useState, useEffect, useCallback } from 'react';
import { EmailField } from './EmailField';

/**
 * Candidate data interface
 */
interface Candidate {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  resume?: string;
  // Add other candidate fields as needed
}

/**
 * Props for the CandidateForm component
 */
interface CandidateFormProps {
  /** Initial candidate data (e.g., from CV parsing) */
  candidate?: Candidate;
  /** Callback when form is submitted */
  onSubmit?: (data: Candidate) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Whether the form is in loading state */
  isLoading?: boolean;
}

/**
 * CandidateForm component for creating/editing candidate information.
 * Includes editable email field with validation.
 */
export const CandidateForm: React.FC<CandidateFormProps> = ({
  candidate,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  // Form state
  const [name, setName] = useState(candidate?.name || '');
  const [email, setEmail] = useState(candidate?.email || '');
  const [phone, setPhone] = useState(candidate?.phone || '');
  const [resume, setResume] = useState(candidate?.resume || '');

  // Validation state
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Update email when candidate data changes (e.g., from CV parsing)
   */
  useEffect(() => {
    if (candidate?.email) {
      setEmail(candidate.email);
    }
  }, [candidate?.email]);

  /**
   * Update other fields when candidate data changes
   */
  useEffect(() => {
    if (candidate?.name) {
      setName(candidate.name);
    }
    if (candidate?.phone) {
      setPhone(candidate.phone);
    }
    if (candidate?.resume) {
      setResume(candidate.resume);
    }
  }, [candidate?.name, candidate?.phone, candidate?.resume]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't submit if email is invalid
    if (!isEmailValid) {
      return;
    }

    if (!onSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      const candidateData: Candidate = {
        ...candidate,
        name,
        email,
        phone,
        resume,
      };

      await onSubmit(candidateData);
    } catch (error) {
      console.error('Failed to save candidate:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [candidate, name, email, phone, resume, isEmailValid, onSubmit]);

  /**
   * Check if form can be submitted
   */
  const canSubmit = isEmailValid && !isSubmitting && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="candidate-form">
      <div className="form-field">
        <label htmlFor="candidate-name">Name</label>
        <input
          id="candidate-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter candidate name"
          disabled={isLoading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="candidate-email">Email</label>
        <EmailField
          value={email}
          onChange={setEmail}
          onValidationChange={setIsEmailValid}
        />
      </div>

      <div className="form-field">
        <label htmlFor="candidate-phone">Phone</label>
        <input
          id="candidate-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          disabled={isLoading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="candidate-resume">Resume</label>
        <textarea
          id="candidate-resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste resume content or notes"
          disabled={isLoading}
          rows={5}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn-cancel"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-save"
        >
          {isSubmitting ? 'Saving...' : 'Save Candidate'}
        </button>
      </div>
    </form>
  );
};

export default CandidateForm;
