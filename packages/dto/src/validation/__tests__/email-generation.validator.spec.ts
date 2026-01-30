/**
 * Unit tests for email generation validation logic
 * Tests shared validation functions for candidate data, job descriptions,
 * and email generation input validation.
 */

import {
  validateCandidateData,
  validateJobDescription,
  validateEmailGenerationInput,
  formatValidationErrors,
} from '../email-generation.validator';

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
      const errors = validateCandidateData({ name: '', email: 'test@example.com' });
      expect(errors.some(e => e.field === 'candidate.name')).toBe(true);
    });

    it('should return error when name is only whitespace', () => {
      const errors = validateCandidateData({ name: '   ', email: 'test@example.com' });
      expect(errors.some(e => e.field === 'candidate.name')).toBe(true);
    });

    it('should return error when email is missing', () => {
      const errors = validateCandidateData({ name: 'John', email: '' });
      expect(errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should return error when email is invalid', () => {
      const errors = validateCandidateData({ name: 'John', email: 'invalid-email' });
      expect(errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should return error when email is missing @ symbol', () => {
      const errors = validateCandidateData({ name: 'John', email: 'johndoe.com' });
      expect(errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should return error when email is missing domain', () => {
      const errors = validateCandidateData({ name: 'John', email: 'john@' });
      expect(errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should return no errors for valid candidate', () => {
      const errors = validateCandidateData({ name: 'John Doe', email: 'john@example.com' });
      expect(errors).toHaveLength(0);
    });

    it('should return no errors for valid candidate with complex email', () => {
      const errors = validateCandidateData({ name: 'Jane Smith', email: 'jane.smith+test@company.co.uk' });
      expect(errors).toHaveLength(0);
    });

    it('should return multiple errors when both name and email are invalid', () => {
      const errors = validateCandidateData({ name: '', email: 'invalid' });
      expect(errors.length).toBeGreaterThanOrEqual(2);
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

    it('should return error when title is missing', () => {
      const errors = validateJobDescription({ title: '', description: 'Some description' });
      expect(errors.some(e => e.field === 'jobDescription.title')).toBe(true);
    });

    it('should return error when title is only whitespace', () => {
      const errors = validateJobDescription({ title: '   ', description: 'Some description' });
      expect(errors.some(e => e.field === 'jobDescription.title')).toBe(true);
    });

    it('should return error when description is missing', () => {
      const errors = validateJobDescription({ title: 'Engineer', description: '' });
      expect(errors.some(e => e.field === 'jobDescription.description')).toBe(true);
    });

    it('should return no errors for valid job description', () => {
      const errors = validateJobDescription({ title: 'Engineer', description: 'Build stuff' });
      expect(errors).toHaveLength(0);
    });

    it('should return no errors for valid job description with detailed content', () => {
      const errors = validateJobDescription({
        title: 'Senior Software Engineer',
        description: 'We are looking for an experienced engineer to join our team and build scalable systems.',
      });
      expect(errors).toHaveLength(0);
    });

    it('should return multiple errors when both title and description are missing', () => {
      const errors = validateJobDescription({ title: '', description: '' });
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('validateEmailGenerationInput', () => {
    it('should return isValid true when all fields are valid', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: 'John', email: 'john@example.com' },
        jobDescription: { title: 'Engineer', description: 'Build stuff' },
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return isValid false with errors when fields are missing', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: '', email: '' },
        jobDescription: { title: '', description: '' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return isValid false when candidate is null', () => {
      const result = validateEmailGenerationInput({
        candidate: null as any,
        jobDescription: { title: 'Engineer', description: 'Build stuff' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'candidate')).toBe(true);
    });

    it('should return isValid false when jobDescription is null', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: 'John', email: 'john@example.com' },
        jobDescription: null as any,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'jobDescription')).toBe(true);
    });

    it('should return isValid false when only candidate email is invalid', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: 'John', email: 'invalid-email' },
        jobDescription: { title: 'Engineer', description: 'Build stuff' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should aggregate errors from both candidate and job description', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: '', email: 'invalid' },
        jobDescription: { title: '', description: '' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('formatValidationErrors', () => {
    it('should format errors as comma-separated string', () => {
      const errors = [
        { field: 'name', message: 'Name is required' },
        { field: 'email', message: 'Email is required' },
      ];
      const formatted = formatValidationErrors(errors);
      expect(formatted).toBe('Name is required, Email is required');
    });

    it('should return single message when only one error', () => {
      const errors = [{ field: 'name', message: 'Name is required' }];
      const formatted = formatValidationErrors(errors);
      expect(formatted).toBe('Name is required');
    });

    it('should return empty string when no errors', () => {
      const errors: Array<{ field: string; message: string }> = [];
      const formatted = formatValidationErrors(errors);
      expect(formatted).toBe('');
    });

    it('should handle multiple errors correctly', () => {
      const errors = [
        { field: 'name', message: 'Name is required' },
        { field: 'email', message: 'Email is required' },
        { field: 'title', message: 'Title is required' },
      ];
      const formatted = formatValidationErrors(errors);
      expect(formatted).toBe('Name is required, Email is required, Title is required');
    });
  });
});
