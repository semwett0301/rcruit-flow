/**
 * ValidationErrorAlert Component
 *
 * A reusable component to display validation error messages in an accessible alert format.
 * Supports optional dismiss functionality and follows ARIA best practices.
 */
import React from 'react';
import { ValidationError } from '@repo/dto';

/**
 * Props for the ValidationErrorAlert component
 */
interface ValidationErrorAlertProps {
  /** Array of validation errors to display */
  errors: ValidationError[];
  /** Optional callback function when the alert is dismissed */
  onDismiss?: () => void;
}

/**
 * Displays a list of validation errors in an accessible alert container.
 *
 * @param props - Component props
 * @param props.errors - Array of validation errors to display
 * @param props.onDismiss - Optional callback to handle alert dismissal
 * @returns The validation error alert component, or null if no errors
 *
 * @example
 * ```tsx
 * <ValidationErrorAlert
 *   errors={[{ field: 'email', message: 'Email is required' }]}
 *   onDismiss={() => setErrors([])}
 * />
 * ```
 */
export const ValidationErrorAlert: React.FC<ValidationErrorAlertProps> = ({
  errors,
  onDismiss,
}) => {
  // Don't render anything if there are no errors
  if (errors.length === 0) return null;

  return (
    <div className="validation-error-alert" role="alert" aria-live="polite">
      <div className="validation-error-header">
        <span className="validation-error-icon" aria-hidden="true">
          ⚠️
        </span>
        <strong>Please complete the following required fields:</strong>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="validation-error-dismiss"
            aria-label="Dismiss validation errors"
          >
            ×
          </button>
        )}
      </div>
      <ul className="validation-error-list">
        {errors.map((error, index) => (
          <li key={`${error.field}-${index}`} className="validation-error-item">
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationErrorAlert;
