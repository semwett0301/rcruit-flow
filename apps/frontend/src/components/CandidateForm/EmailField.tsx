/**
 * EmailField Component
 *
 * A reusable controlled input component for email editing with validation.
 * Provides real-time validation feedback and accessibility support.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { validateEmail } from '../../utils/validation';

/**
 * Props for the EmailField component
 */
interface EmailFieldProps {
  /** Current email value */
  value: string;
  /** Callback fired when email value changes */
  onChange: (email: string) => void;
  /** Optional callback fired when validation state changes */
  onValidationChange?: (isValid: boolean) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
}

/**
 * EmailField - A controlled input component for email editing with validation
 *
 * Features:
 * - Real-time email validation on blur and subsequent changes
 * - Accessible error messaging with ARIA attributes
 * - Visual error state indication
 * - Controlled component pattern for form integration
 *
 * @example
 * ```tsx
 * const [email, setEmail] = useState('');
 * const [isValid, setIsValid] = useState(false);
 *
 * <EmailField
 *   value={email}
 *   onChange={setEmail}
 *   onValidationChange={setIsValid}
 * />
 * ```
 */
export const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChange,
  onValidationChange,
  disabled = false,
}) => {
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);

  // Memoize the validation change callback to prevent unnecessary re-renders
  const handleValidationChange = useCallback(
    (isValid: boolean) => {
      onValidationChange?.(isValid);
    },
    [onValidationChange]
  );

  // Validate email when value changes and field has been touched
  useEffect(() => {
    if (touched) {
      const validation = validateEmail(value);
      setError(validation.error);
      handleValidationChange(validation.isValid);
    }
  }, [value, touched, handleValidationChange]);

  /**
   * Handle input blur - marks field as touched to enable validation
   */
  const handleBlur = () => {
    setTouched(true);
  };

  /**
   * Handle input change - propagates value to parent
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const hasError = error && touched;

  return (
    <div className="email-field">
      <label htmlFor="candidate-email">Email</label>
      <input
        id="candidate-email"
        type="email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={hasError ? 'error' : ''}
        aria-invalid={!!hasError}
        aria-describedby={hasError ? 'email-error' : undefined}
      />
      {hasError && (
        <span id="email-error" className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default EmailField;
