import React, { useState, useCallback } from 'react';
import { EditableEmailField } from './EditableEmailField';
import { useCandidateEmail } from '../../hooks/useCandidateEmail';

/**
 * Props for the CandidateForm component
 */
interface CandidateFormProps {
  /** The candidate data to display/edit */
  candidate?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
    notes?: string;
  };
  /** Callback when form is submitted */
  onSubmit?: (data: CandidateFormData) => void;
  /** Callback when send action is triggered */
  onSend?: (data: CandidateFormData) => void;
  /** Whether the form is in loading state */
  isLoading?: boolean;
}

/**
 * Form data structure for candidate submissions
 */
export interface CandidateFormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  notes: string;
}

/**
 * CandidateForm component for creating and editing candidate information.
 * Includes editable email field with validation.
 */
export const CandidateForm: React.FC<CandidateFormProps> = ({
  candidate,
  onSubmit,
  onSend,
  isLoading = false,
}) => {
  // Initialize email hook for email field management and validation
  const { email, isEmailValid, setEmail } = useCandidateEmail(
    candidate?.email || ''
  );

  // Form state for other fields
  const [name, setName] = useState(candidate?.name || '');
  const [phone, setPhone] = useState(candidate?.phone || '');
  const [position, setPosition] = useState(candidate?.position || '');
  const [notes, setNotes] = useState(candidate?.notes || '');

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
   * Builds the form data payload for submission
   */
  const buildFormData = useCallback((): CandidateFormData => {
    return {
      id: candidate?.id,
      name,
      email, // Use the email from the hook (potentially modified)
      phone,
      position,
      notes,
    };
  }, [candidate?.id, name, email, phone, position, notes]);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isEmailValid) {
        return;
      }
      const formData = buildFormData();
      onSubmit?.(formData);
    },
    [isEmailValid, buildFormData, onSubmit]
  );

  /**
   * Handles send action
   */
  const handleSend = useCallback(() => {
    if (!isEmailValid) {
      return;
    }
    const formData = buildFormData();
    onSend?.(formData);
  }, [isEmailValid, buildFormData, onSend]);

  // Determine if action buttons should be disabled
  const isActionsDisabled = isLoading || !isEmailValid;

  return (
    <form onSubmit={handleSubmit} className="candidate-form">
      <div className="form-group">
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

      <div className="form-group">
        <label htmlFor="candidate-email">Email</label>
        <EditableEmailField
          initialEmail={candidate?.email || ''}
          onEmailChange={handleEmailChange}
        />
      </div>

      <div className="form-group">
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

      <div className="form-group">
        <label htmlFor="candidate-position">Position</label>
        <input
          id="candidate-position"
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Enter position"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="candidate-notes">Notes</label>
        <textarea
          id="candidate-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter notes"
          disabled={isLoading}
          rows={4}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={isActionsDisabled}
          className="btn-save"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
        {onSend && (
          <button
            type="button"
            onClick={handleSend}
            disabled={isActionsDisabled}
            className="btn-send"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        )}
      </div>

      {!isEmailValid && email && (
        <p className="validation-error">
          Please enter a valid email address before saving or sending.
        </p>
      )}
    </form>
  );
};

export default CandidateForm;
