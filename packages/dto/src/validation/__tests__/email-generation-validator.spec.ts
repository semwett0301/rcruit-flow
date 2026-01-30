/**
 * Unit tests for email generation validation functions.
 * Tests shared validation utilities for candidate data, job descriptions,
 * and email generation input validation.
 */

import {
  validateCandidateData,
  validateJobDescription,
  validateEmailGenerationInput,
  formatValidationErrors,
} from '../email-generation-validator';

describe('Email Generation Validator', () => {
  describe('validateCandidateData', () => {
    it('should return error when candidate is null', () => {
      const errors = validateCandidateData(null);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('candidate');
    });

    it('should return error when candidate is undefined', () => {
      const errors = validateCandidateData(undefined);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('candidate');
    });

    it('should return error when name is missing', () => {
      const errors = validateCandidateData({ email: 'test@example.com' });
      expect(errors.some(e => e.field === 'candidate.name')).toBe(true);
    });

    it('should return error when name is empty string', () => {
      const errors = validateCandidateData({ name: '', email: 'test@example.com' });
      expect(errors.some(e => e.field === 'candidate.name')).toBe(true);
    });

    it('should return error when email is missing', () => {
      const errors = validateCandidateData({ name: 'John' });
      expect(errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should return error when email is invalid', () => {
      const errors = validateCandidateData({ name: 'John', email: 'invalid' });
      expect(errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should return error when email is missing @ symbol', () => {
      const errors = validateCandidateData({ name: 'John', email: 'johnexample.com' });
      expect(errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should return no errors for valid data', () => {
      const errors = validateCandidateData({ name: 'John', email: 'john@example.com' });
      expect(errors).toHaveLength(0);
    });

    it('should return no errors for valid data with additional fields', () => {
      const errors = validateCandidateData({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
      });
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateJobDescription', () => {
    it('should return error when job is null', () => {
      const errors = validateJobDescription(null);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('jobDescription');
    });

    it('should return error when job is undefined', () => {
      const errors = validateJobDescription(undefined);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('jobDescription');
    });

    it('should return errors for missing required fields', () => {
      const errors = validateJobDescription({});
      expect(errors.some(e => e.field === 'jobDescription.title')).toBe(true);
      expect(errors.some(e => e.field === 'jobDescription.company')).toBe(true);
      expect(errors.some(e => e.field === 'jobDescription.description')).toBe(true);
    });

    it('should return error when title is missing', () => {
      const errors = validateJobDescription({ company: 'Acme', description: 'Build' });
      expect(errors.some(e => e.field === 'jobDescription.title')).toBe(true);
    });

    it('should return error when company is missing', () => {
      const errors = validateJobDescription({ title: 'Dev', description: 'Build' });
      expect(errors.some(e => e.field === 'jobDescription.company')).toBe(true);
    });

    it('should return error when description is missing', () => {
      const errors = validateJobDescription({ title: 'Dev', company: 'Acme' });
      expect(errors.some(e => e.field === 'jobDescription.description')).toBe(true);
    });

    it('should return error when title is empty string', () => {
      const errors = validateJobDescription({ title: '', company: 'Acme', description: 'Build' });
      expect(errors.some(e => e.field === 'jobDescription.title')).toBe(true);
    });

    it('should return no errors for valid data', () => {
      const errors = validateJobDescription({ title: 'Dev', company: 'Acme', description: 'Build' });
      expect(errors).toHaveLength(0);
    });

    it('should return no errors for valid data with additional fields', () => {
      const errors = validateJobDescription({
        title: 'Senior Developer',
        company: 'Acme Corp',
        description: 'Build amazing software',
        location: 'Remote',
        salary: '100k',
      });
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateEmailGenerationInput', () => {
    it('should return invalid when input is null', () => {
      const result = validateEmailGenerationInput(null);
      expect(result.isValid).toBe(false);
    });

    it('should return invalid when input is undefined', () => {
      const result = validateEmailGenerationInput(undefined);
      expect(result.isValid).toBe(false);
    });

    it('should return invalid when candidate is missing', () => {
      const result = validateEmailGenerationInput({
        jobDescription: { title: 'Dev', company: 'Acme', description: 'Build' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid when jobDescription is missing', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: 'John', email: 'john@example.com' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid when candidate data is invalid', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: '', email: 'invalid' },
        jobDescription: { title: 'Dev', company: 'Acme', description: 'Build' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid when job description data is invalid', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: 'John', email: 'john@example.com' },
        jobDescription: { title: '', company: '', description: '' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return valid for complete input', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: 'John', email: 'john@example.com' },
        jobDescription: { title: 'Dev', company: 'Acme', description: 'Build' },
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid for complete input with additional fields', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
        jobDescription: { title: 'Dev', company: 'Acme', description: 'Build', location: 'Remote' },
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('formatValidationErrors', () => {
    it('should return empty string for no errors', () => {
      expect(formatValidationErrors([])).toBe('');
    });

    it('should return single message without bullet', () => {
      const result = formatValidationErrors([{ field: 'test', message: 'Error' }]);
      expect(result).toBe('Error');
    });

    it('should format multiple errors with bullets', () => {
      const result = formatValidationErrors([
        { field: 'a', message: 'Error 1' },
        { field: 'b', message: 'Error 2' },
      ]);
      expect(result).toContain('• Error 1');
      expect(result).toContain('• Error 2');
    });

    it('should format three errors with bullets', () => {
      const result = formatValidationErrors([
        { field: 'a', message: 'First error' },
        { field: 'b', message: 'Second error' },
        { field: 'c', message: 'Third error' },
      ]);
      expect(result).toContain('• First error');
      expect(result).toContain('• Second error');
      expect(result).toContain('• Third error');
    });

    it('should handle errors with empty messages', () => {
      const result = formatValidationErrors([{ field: 'test', message: '' }]);
      expect(result).toBe('');
    });
  });
});
