/**
 * Custom hook for email generation validation logic.
 * Provides state management and validation utilities for email generation input.
 */
import { useState, useCallback } from 'react';
import {
  EmailGenerationInput,
  ValidationResult,
  ValidationError,
  validateEmailGenerationInput,
} from '@repo/dto';

/**
 * Return type for the useEmailGenerationValidation hook.
 */
export interface UseEmailGenerationValidationReturn {
  /** Array of current validation errors */
  validationErrors: ValidationError[];
  /** Whether the current input is valid */
  isValid: boolean;
  /** Validate the given input and update state */
  validate: (input: EmailGenerationInput) => ValidationResult;
  /** Clear all validation errors and reset to valid state */
  clearErrors: () => void;
  /** Manually set validation errors */
  setErrors: (errors: ValidationError[]) => void;
}

/**
 * Custom hook for managing email generation validation state.
 *
 * @returns {UseEmailGenerationValidationReturn} Validation state and utilities
 *
 * @example
 * ```tsx
 * const { validationErrors, isValid, validate, clearErrors } = useEmailGenerationValidation();
 *
 * const handleSubmit = (input: EmailGenerationInput) => {
 *   const result = validate(input);
 *   if (result.isValid) {
 *     // Proceed with submission
 *   }
 * };
 * ```
 */
export function useEmailGenerationValidation(): UseEmailGenerationValidationReturn {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState<boolean>(true);

  /**
   * Validates the email generation input and updates the validation state.
   * @param input - The email generation input to validate
   * @returns The validation result
   */
  const validate = useCallback((input: EmailGenerationInput): ValidationResult => {
    const result = validateEmailGenerationInput(input);
    setValidationErrors(result.errors);
    setIsValid(result.isValid);
    return result;
  }, []);

  /**
   * Clears all validation errors and resets the valid state to true.
   */
  const clearErrors = useCallback(() => {
    setValidationErrors([]);
    setIsValid(true);
  }, []);

  /**
   * Manually sets validation errors and updates the valid state accordingly.
   * @param errors - Array of validation errors to set
   */
  const setErrors = useCallback((errors: ValidationError[]) => {
    setValidationErrors(errors);
    setIsValid(errors.length === 0);
  }, []);

  return {
    validationErrors,
    isValid,
    validate,
    clearErrors,
    setErrors,
  };
}
