import React, { useState, useCallback } from 'react';
import { EditableEmailField } from './EditableEmailField';
import { useCandidateEmail } from '../../hooks/useCandidateEmail';

/**
 * Props for the CandidateForm component
 */
interface CandidateFormProps {
  /** The candidate data to display/edit */
  candidate: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    position?: string;
    notes?: string;
  };
  /** Callback when form is submitted */
  onSubmit: (data: CandidateFormData) => void;
  /** Callback when form is saved as draft */
  onSave?: (data: CandidateFormData) => void;
  /** Whether the form is currently submitting */
  isSubmitting?: boolean;
}

/**
 * Data structure for form submission
 */
export interface CandidateFormData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  notes?: string;
}

/**
 * CandidateForm component for editing candidate information
 * Integrates EditableEmailField for email validation and editing
 */
export const CandidateForm: React.FC<CandidateFormProps> = ({
  candidate,
  onSubmit,
  onSave,
  isSubmitting = false,
}) => {
  // Use the custom hook for email state management
  const { email, isEmailValid, isEmailModified, setEmail } = useCandidateEmail(
    candidate.email
  );

  // Local form state for other fields
  const [name, setName] = useState(candidate.name);
  const [phone, setPhone] = useState(candidate.phone || '');
  const [position, setPosition] = useState(candidate.position || '');
  const [notes, setNotes] = useState(candidate.notes || '');

  /**
   * Handles email changes from the EditableEmailField component
   */
  const handleEmailChange = useCallback(
    (newEmail: string, valid: boolean) => {
      setEmail(newEmail);
    },
    [setEmail]
  );

  /**
   * Validates the entire form before submission
   */
  const isFormValid = useCallback((): boolean => {
    // Check email validity
    if (!isEmailValid) {
      return false;
    }

    // Check required fields
    if (!name.trim()) {
      return false;
    }

    return true;
  }, [isEmailValid, name]);

  /**
   * Builds the form data object for submission
   */
  const buildFormData = useCallback((): CandidateFormData => {
    return {
      id: candidate.id,
      name: name.trim(),
      email, // Use the email from the hook, not candidate.email
      phone: phone.trim() || undefined,
      position: position.trim() || undefined,
      notes: notes.trim() || undefined,
    };
  }, [candidate.id, name, email, phone, position, notes]);

  /**
   * Handles form submission (send)
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Validate before submission
      if (!isEmailValid) {
        return;
      }

      if (!isFormValid()) {
        return;
      }

      const formData = buildFormData();
      onSubmit(formData);
    },
    [isEmailValid, isFormValid, buildFormData, onSubmit]
  );

  /**
   * Handles saving the form as draft
   */
  const handleSave = useCallback(() => {
    // Validate email before saving
    if (!isEmailValid) {
      return;
    }

    if (!onSave) {
      return;
    }

    const formData = buildFormData();
    onSave(formData);
  }, [isEmailValid, buildFormData, onSave]);

  // Determine if buttons should be disabled
  const isButtonDisabled = isSubmitting || !isEmailValid;
  const isSendDisabled = isButtonDisabled || !isFormValid();

  return (
    <form onSubmit={handleSubmit} className="candidate-form">
      <div className="form-group">
        <label htmlFor="candidate-name">Name *</label>
        <input
          id="candidate-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          required
          placeholder="Enter candidate name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="candidate-email">Email *</label>
        <EditableEmailField
          initialEmail={candidate.email}
          onEmailChange={handleEmailChange}
          disabled={isSubmitting}
        />
        {isEmailModified && isEmailValid && (
          <span className="email-modified-indicator">
            Email has been modified
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="candidate-phone">Phone</label>
        <input
          id="candidate-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isSubmitting}
          placeholder="Enter phone number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="candidate-position">Position</label>
        <input
          id="candidate-position"
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          disabled={isSubmitting}
          placeholder="Enter position"
        />
      </div>

      <div className="form-group">
        <label htmlFor="candidate-notes">Notes</label>
        <textarea
          id="candidate-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isSubmitting}
          placeholder="Enter any additional notes"
          rows={4}
        />
      </div>

      <div className="form-actions">
        {onSave && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isButtonDisabled}
            className="btn btn-secondary"
          >
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>
        )}
        <button
          type="submit"
          disabled={isSendDisabled}
          className="btn btn-primary"
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </div>

      {!isEmailValid && (
        <div className="form-error" role="alert">
          Please enter a valid email address before submitting.
        </div>
      )}
    </form>
  );
};

export default CandidateForm;
