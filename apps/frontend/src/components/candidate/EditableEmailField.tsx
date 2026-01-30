/**
 * EditableEmailField Component
 *
 * A reusable email input field component with built-in validation.
 * Displays validation errors after the field has been touched (blurred).
 */
import React, { useState, useEffect } from 'react';
import { getEmailValidationError } from '../../utils/validation/emailValidation';

/**
 * Props for the EditableEmailField component
 */
interface EditableEmailFieldProps {
  /** Initial email value to populate the field */
  initialEmail: string;
  /** Callback fired when email changes, provides the new email and validity status */
  onEmailChange: (email: string, isValid: boolean) => void;
  /** Whether the field should be disabled */
  disabled?: boolean;
}

/**
 * Editable email field with validation support.
 *
 * Features:
 * - Real-time validation on change
 * - Error display only after field is touched (blur)
 * - Syncs with initialEmail prop changes
 * - Accessible with proper label association
 *
 * @example
 * ```tsx
 * <EditableEmailField
 *   initialEmail="user@example.com"
 *   onEmailChange={(email, isValid) => {
 *     console.log('Email:', email, 'Valid:', isValid);
 *   }}
 * />
 * ```
 */
export const EditableEmailField: React.FC<EditableEmailFieldProps> = ({
  initialEmail,
  onEmailChange,
  disabled = false,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Sync internal state when initialEmail prop changes
  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  /**
   * Handles input change events.
   * Validates the email and notifies parent of changes.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const validationError = getEmailValidationError(newEmail);
    setError(validationError);
    onEmailChange(newEmail, !validationError);
  };

  /**
   * Handles blur events.
   * Marks the field as touched to enable error display.
   */
  const handleBlur = () => {
    setTouched(true);
    const validationError = getEmailValidationError(email);
    setError(validationError);
  };

  const showError = error && touched;

  return (
    <div className="editable-email-field">
      <label htmlFor="candidate-email">Email</label>
      <input
        id="candidate-email"
        type="email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={showError ? 'error' : ''}
        placeholder="Enter email address"
        aria-invalid={showError ? 'true' : 'false'}
        aria-describedby={showError ? 'candidate-email-error' : undefined}
      />
      {showError && (
        <span id="candidate-email-error" className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default EditableEmailField;
