/**
 * Custom hook to manage candidate email state and validation.
 * Provides email state management with validation and modification tracking.
 */
import { useState, useCallback } from 'react';
import { isValidEmail } from '../utils/validation/emailValidation';

/**
 * Return type for the useCandidateEmail hook
 */
interface UseCandidateEmailReturn {
  /** Current email value */
  email: string;
  /** Whether the current email is valid */
  isEmailValid: boolean;
  /** Whether the email has been modified from its original value */
  isEmailModified: boolean;
  /** Function to update the email value */
  setEmail: (email: string) => void;
  /** Function to reset email to a new original value */
  resetEmail: (originalEmail: string) => void;
}

/**
 * Custom hook to manage candidate email state and validation.
 *
 * @param initialEmail - The initial email value to start with
 * @returns Object containing email state, validation status, and control functions
 *
 * @example
 * ```tsx
 * const { email, isEmailValid, isEmailModified, setEmail, resetEmail } = useCandidateEmail('user@example.com');
 *
 * // Update email
 * setEmail('newemail@example.com');
 *
 * // Reset to a new original value
 * resetEmail('original@example.com');
 * ```
 */
export const useCandidateEmail = (initialEmail: string): UseCandidateEmailReturn => {
  const [email, setEmailState] = useState(initialEmail);
  const [originalEmail, setOriginalEmail] = useState(initialEmail);
  const [isEmailValid, setIsEmailValid] = useState(isValidEmail(initialEmail));

  /**
   * Updates the email value and validates it
   */
  const setEmail = useCallback((newEmail: string) => {
    setEmailState(newEmail);
    setIsEmailValid(isValidEmail(newEmail));
  }, []);

  /**
   * Resets the email to a new original value.
   * This updates both the current email and the original email reference.
   */
  const resetEmail = useCallback((newOriginalEmail: string) => {
    setOriginalEmail(newOriginalEmail);
    setEmailState(newOriginalEmail);
    setIsEmailValid(isValidEmail(newOriginalEmail));
  }, []);

  const isEmailModified = email !== originalEmail;

  return {
    email,
    isEmailValid,
    isEmailModified,
    setEmail,
    resetEmail,
  };
};

export default useCandidateEmail;
