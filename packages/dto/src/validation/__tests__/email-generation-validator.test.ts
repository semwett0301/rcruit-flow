/**
 * Unit tests for email generation validation functions
 * Tests validateCandidateData, validateJobDescription, and validateEmailGenerationInput
 */

import {
  validateCandidateData,
  validateJobDescription,
  validateEmailGenerationInput,
} from '../email-generation-validator';

describe('Email Generation Validation', () => {
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

    it('should return error when email is invalid', () => {
      const errors = validateCandidateData({ name: 'John', email: 'invalid-email' });
      expect(errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should return error when email is missing', () => {
      const errors = validateCandidateData({ name: 'John', email: '' });
      expect(errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should return error when email has no domain', () => {
      const errors = validateCandidateData({ name: 'John', email: 'john@' });
      expect(errors.some(e => e.field === 'candidate.email')).toBe(true);
    });

    it('should return no errors for valid candidate', () => {
      const errors = validateCandidateData({ name: 'John Doe', email: 'john@example.com' });
      expect(errors).toHaveLength(0);
    });

    it('should return no errors for valid candidate with complex email', () => {
      const errors = validateCandidateData({ name: 'Jane Smith', email: 'jane.smith+test@sub.example.co.uk' });
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateJobDescription', () => {
    it('should return error when job description is null', () => {
      const errors = validateJobDescription(null);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('jobDescription');
    });

    it('should return error when job description is undefined', () => {
      const errors = validateJobDescription(undefined);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('jobDescription');
    });

    it('should return errors for missing required fields', () => {
      const errors = validateJobDescription({ title: '', company: '', description: '' });
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return error when title is missing', () => {
      const errors = validateJobDescription({
        title: '',
        company: 'Tech Corp',
        description: 'Build software',
      });
      expect(errors.some(e => e.field === 'jobDescription.title')).toBe(true);
    });

    it('should return error when company is missing', () => {
      const errors = validateJobDescription({
        title: 'Software Engineer',
        company: '',
        description: 'Build software',
      });
      expect(errors.some(e => e.field === 'jobDescription.company')).toBe(true);
    });

    it('should return error when description is missing', () => {
      const errors = validateJobDescription({
        title: 'Software Engineer',
        company: 'Tech Corp',
        description: '',
      });
      expect(errors.some(e => e.field === 'jobDescription.description')).toBe(true);
    });

    it('should return no errors for valid job description', () => {
      const errors = validateJobDescription({
        title: 'Software Engineer',
        company: 'Tech Corp',
        description: 'Build amazing software',
      });
      expect(errors).toHaveLength(0);
    });

    it('should return no errors for valid job description with extra fields', () => {
      const errors = validateJobDescription({
        title: 'Senior Developer',
        company: 'Startup Inc',
        description: 'Lead development team',
        location: 'Remote',
        salary: '100k',
      });
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateEmailGenerationInput', () => {
    it('should return invalid when both are missing', () => {
      const result = validateEmailGenerationInput({ candidate: null, jobDescription: null });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should return invalid when candidate is missing', () => {
      const result = validateEmailGenerationInput({
        candidate: null,
        jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'candidate')).toBe(true);
    });

    it('should return invalid when job description is missing', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: 'John', email: 'john@example.com' },
        jobDescription: null,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'jobDescription')).toBe(true);
    });

    it('should return invalid when candidate has invalid data', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: '', email: 'invalid' },
        jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid when job description has invalid data', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: 'John', email: 'john@example.com' },
        jobDescription: { title: '', company: '', description: '' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return valid when all required fields are present', () => {
      const result = validateEmailGenerationInput({
        candidate: { name: 'John', email: 'john@example.com' },
        jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid for complete valid input', () => {
      const result = validateEmailGenerationInput({
        candidate: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        jobDescription: {
          title: 'Senior Software Engineer',
          company: 'Tech Corporation',
          description: 'We are looking for an experienced engineer to join our team.',
        },
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
