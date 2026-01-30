/**
 * React hook for email generation validation state management.
 * Provides validation utilities for email generation input forms.
 */
import { useState, useCallback, useMemo } from 'react';
import {
  validateEmailGenerationInput,
  formatValidationErrors,
  EmailGenerationInput,
  ValidationResult,
} from '@repo/dto';

/**
 * Return type for the useEmailGenerationValidation hook.
 */
export interface UseEmailGenerationValidationReturn {
  /** Current validation result containing isValid flag and errors array */
  validationResult: ValidationResult;
  /** Formatted error message string from all validation errors */
  errorMessage: string;
  /** Convenience boolean indicating if current state is valid */
  isValid: boolean;
  /** Function to validate an email generation input and update state */
  validate: (input: EmailGenerationInput) => ValidationResult;
  /** Function to clear all validation errors and reset to valid state */
  clearErrors: () => void;
  /** Function to get the error message for a specific field */
  getFieldError: (field: string) => string | undefined;
}

/**
 * Hook for managing email generation validation state.
 *
 * Provides reactive validation state management with utilities for:
 * - Validating email generation input
 * - Retrieving field-specific errors
 * - Clearing validation errors
 * - Getting formatted error messages
 *
 * @returns {UseEmailGenerationValidationReturn} Validation state and utilities
 *
 * @example
 * ```tsx
 * const { validate, isValid, errorMessage, getFieldError } = useEmailGenerationValidation();
 *
 * const handleSubmit = (input: EmailGenerationInput) => {
 *   const result = validate(input);
 *   if (result.isValid) {
 *     // Proceed with submission
 *   }
 * };
 *
 * // Display field-specific error
 * const subjectError = getFieldError('subject');
 * ```
 */
export function useEmailGenerationValidation(): UseEmailGenerationValidationReturn {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });

  /**
   * Validates the provided email generation input and updates state.
   * @param input - The email generation input to validate
   * @returns The validation result
   */
  const validate = useCallback((input: EmailGenerationInput): ValidationResult => {
    const result = validateEmailGenerationInput(input);
    setValidationResult(result);
    return result;
  }, []);

  /**
   * Clears all validation errors and resets to valid state.
   */
  const clearErrors = useCallback(() => {
    setValidationResult({ isValid: true, errors: [] });
  }, []);

  /**
   * Formatted error message derived from current validation errors.
   */
  const errorMessage = useMemo(
    () => formatValidationErrors(validationResult.errors),
    [validationResult.errors]
  );

  /**
   * Gets the error message for a specific field.
   * @param field - The field name to get the error for
   * @returns The error message if found, undefined otherwise
   */
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return validationResult.errors.find((e) => e.field === field)?.message;
    },
    [validationResult.errors]
  );

  return {
    validationResult,
    errorMessage,
    isValid: validationResult.isValid,
    validate,
    clearErrors,
    getFieldError,
  };
}
