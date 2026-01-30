/**
 * Validation utility functions for frontend form validation.
 * Contains email validation and other common validation helpers.
 */

/**
 * Checks if an email address has a valid format.
 * Uses a simple regex pattern that validates basic email structure.
 *
 * @param email - The email address to validate
 * @returns true if the email format is valid, false otherwise
 *
 * @example
 * isValidEmail('user@example.com') // returns true
 * isValidEmail('invalid-email') // returns false
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Result type for email validation with optional error message.
 */
export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an email address and returns a result object with validation status
 * and an error message if validation fails.
 *
 * @param email - The email address to validate
 * @returns An object containing isValid boolean and optional error message
 *
 * @example
 * validateEmail('user@example.com') // returns { isValid: true }
 * validateEmail('') // returns { isValid: false, error: 'Email is required' }
 * validateEmail('invalid') // returns { isValid: false, error: 'Please enter a valid email address' }
 */
export const validateEmail = (email: string): EmailValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};
