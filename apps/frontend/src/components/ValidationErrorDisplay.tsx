/**
 * ValidationErrorDisplay Component
 *
 * A reusable component to display validation errors in a user-friendly format.
 * Shows a styled error box with a list of validation messages.
 */
import React from 'react';
import { ValidationError } from '@recruit-flow/dto';

/**
 * Props for the ValidationErrorDisplay component
 */
interface ValidationErrorDisplayProps {
  /** Array of validation errors to display */
  errors: ValidationError[];
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Displays a list of validation errors in a styled container.
 * Returns null if there are no errors to display.
 *
 * @example
 * ```tsx
 * <ValidationErrorDisplay
 *   errors={[{ field: 'email', message: 'Email is required' }]}
 *   className="mt-4"
 * />
 * ```
 */
export const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  errors,
  className = '',
}) => {
  // Don't render anything if there are no errors
  if (errors.length === 0) {
    return null;
  }

  return (
    <div
      className={`validation-errors bg-red-50 border border-red-200 rounded-md p-4 ${className}`.trim()}
      role="alert"
      aria-live="polite"
    >
      <h4 className="text-red-800 font-medium mb-2">
        Please fix the following errors:
      </h4>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li
            key={`${error.field}-${index}`}
            className="text-red-600 text-sm"
          >
            <span className="font-medium">{error.field}:</span> {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationErrorDisplay;
