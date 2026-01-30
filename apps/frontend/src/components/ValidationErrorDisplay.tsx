/**
 * ValidationErrorDisplay Component
 *
 * A reusable component to display validation errors in a user-friendly format.
 * Supports accessibility features and optional dismiss functionality.
 */
import React from 'react';
import { ValidationError } from '@repo/dto';

interface ValidationErrorDisplayProps {
  /** Array of validation errors to display */
  errors: ValidationError[];
  /** Optional callback to dismiss/clear the errors */
  onDismiss?: () => void;
}

/**
 * Displays a list of validation errors in an accessible alert container.
 *
 * @param errors - Array of ValidationError objects containing field and message
 * @param onDismiss - Optional callback function to handle dismissing the errors
 * @returns JSX element displaying errors, or null if no errors
 *
 * @example
 * ```tsx
 * <ValidationErrorDisplay
 *   errors={[{ field: 'email', message: 'Email is required' }]}
 *   onDismiss={() => setErrors([])}
 * />
 * ```
 */
export const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  errors,
  onDismiss,
}) => {
  // Don't render anything if there are no errors
  if (errors.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="validation-error-container"
      style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h4
            style={{
              color: '#dc2626',
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            Please complete the following required fields:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#b91c1c' }}>
            {errors.map((error, index) => (
              <li key={`${error.field}-${index}`} style={{ marginBottom: '4px' }}>
                {error.message}
              </li>
            ))}
          </ul>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss errors"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#dc2626',
              fontSize: '20px',
              padding: '0',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ValidationErrorDisplay;
