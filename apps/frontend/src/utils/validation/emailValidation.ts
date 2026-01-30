/**
 * Email validation utility functions for frontend form validation.
 * Provides email format validation and user-friendly error messages.
 */

/**
 * Regular expression pattern for validating email addresses.
 * Matches standard email format: local-part@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates whether a given string is a valid email address format.
 *
 * @param email - The email string to validate
 * @returns true if the email format is valid, false otherwise
 *
 * @example
 * isValidEmail('user@example.com') // returns true
 * isValidEmail('invalid-email') // returns false
 * isValidEmail('') // returns false
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Returns a validation error message for an email input, or null if valid.
 * Useful for form validation to display appropriate error messages to users.
 *
 * @param email - The email string to validate
 * @returns Error message string if invalid, null if valid
 *
 * @example
 * getEmailValidationError('') // returns 'Email is required'
 * getEmailValidationError('invalid') // returns 'Please enter a valid email address'
 * getEmailValidationError('user@example.com') // returns null
 */
export const getEmailValidationError = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};
