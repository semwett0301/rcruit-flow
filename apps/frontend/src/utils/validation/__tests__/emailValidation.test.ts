/**
 * Unit tests for email validation utility functions
 * Tests isValidEmail and getEmailValidationError functions
 */

import { isValidEmail, getEmailValidationError } from '../emailValidation';

describe('emailValidation', () => {
  describe('isValidEmail', () => {
    it('returns true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('getEmailValidationError', () => {
    it('returns null for valid email', () => {
      expect(getEmailValidationError('test@example.com')).toBeNull();
    });

    it('returns error for empty email', () => {
      expect(getEmailValidationError('')).toBe('Email is required');
    });

    it('returns error for invalid format', () => {
      expect(getEmailValidationError('invalid')).toBe('Please enter a valid email address');
    });
  });
});
