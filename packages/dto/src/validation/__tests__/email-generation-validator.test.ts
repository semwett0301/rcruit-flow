/**
 * Unit tests for the email generation validator
 * Tests validation of email generation input and error formatting
 */
import {
  validateCandidateData,
  validateJobDescription,
  validateEmailGenerationInput,
  formatValidationErrors,
} from '../email-generation-validator';

describe('Email Generation Validation', () => {
  describe('validateCandidateData', () => {
    it('should return error when candidate data is null', () => {
      const errors = validateCandidateData(null);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('candidateData');
    });

    it('should return errors for missing required fields', () => {
      const errors = validateCandidateData({ name: '', email: '' });
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should return errors for whitespace-only fields', () => {
      const errors = validateCandidateData({ name: '   ', email: '   ' });
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should return no errors for valid data', () => {
      const errors = validateCandidateData({ name: 'John Doe', email: 'john@example.com' });
      expect(errors).toHaveLength(0);
    });

    it('should return error when candidate data is undefined', () => {
      const errors = validateCandidateData(undefined);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('candidateData');
    });

    it('should return error for missing name only', () => {
      const errors = validateCandidateData({ name: '', email: 'john@example.com' });
      expect(errors.some(e => e.field === 'candidateData.name')).toBe(true);
    });

    it('should return error for missing email only', () => {
      const errors = validateCandidateData({ name: 'John Doe', email: '' });
      expect(errors.some(e => e.field === 'candidateData.email')).toBe(true);
    });
  });

  describe('validateJobDescription', () => {
    it('should return error when job description is null', () => {
      const errors = validateJobDescription(null);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('jobDescription');
    });

    it('should return errors for missing required fields', () => {
      const errors = validateJobDescription({ title: '', description: '' });
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should return no errors for valid data', () => {
      const errors = validateJobDescription({ title: 'Developer', description: 'Build software' });
      expect(errors).toHaveLength(0);
    });

    it('should return error when job description is undefined', () => {
      const errors = validateJobDescription(undefined);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('jobDescription');
    });

    it('should return errors for whitespace-only fields', () => {
      const errors = validateJobDescription({ title: '   ', description: '   ' });
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should return error for missing title only', () => {
      const errors = validateJobDescription({ title: '', description: 'Build software' });
      expect(errors.some(e => e.field === 'jobDescription.title')).toBe(true);
    });

    it('should return error for missing description only', () => {
      const errors = validateJobDescription({ title: 'Developer', description: '' });
      expect(errors.some(e => e.field === 'jobDescription.description')).toBe(true);
    });
  });

  describe('validateEmailGenerationInput', () => {
    it('should return invalid result when both inputs are null', () => {
      const result = validateEmailGenerationInput({ candidateData: null, jobDescription: null });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should return valid result when all required fields are present', () => {
      const result = validateEmailGenerationInput({
        candidateData: { name: 'John', email: 'john@test.com' },
        jobDescription: { title: 'Dev', description: 'Code' },
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid result when candidate data is null', () => {
      const result = validateEmailGenerationInput({
        candidateData: null,
        jobDescription: { title: 'Dev', description: 'Code' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: 'candidateData' }));
    });

    it('should return invalid result when job description is null', () => {
      const result = validateEmailGenerationInput({
        candidateData: { name: 'John', email: 'john@test.com' },
        jobDescription: null,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: 'jobDescription' }));
    });

    it('should return invalid result when candidate name is empty', () => {
      const result = validateEmailGenerationInput({
        candidateData: { name: '', email: 'john@test.com' },
        jobDescription: { title: 'Dev', description: 'Code' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: 'candidateData.name' }));
    });

    it('should return invalid result when job title is empty', () => {
      const result = validateEmailGenerationInput({
        candidateData: { name: 'John', email: 'john@test.com' },
        jobDescription: { title: '', description: 'Code' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ field: 'jobDescription.title' }));
    });

    it('should aggregate errors from both candidate and job validation', () => {
      const result = validateEmailGenerationInput({
        candidateData: { name: '', email: '' },
        jobDescription: { title: '', description: '' },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });
});

describe('formatValidationErrors', () => {
  it('should return empty string for no errors', () => {
    expect(formatValidationErrors([])).toBe('');
  });

  it('should return single message for one error', () => {
    const errors = [{ field: 'test', message: 'Test error' }];
    expect(formatValidationErrors(errors)).toBe('Test error');
  });

  it('should combine multiple errors', () => {
    const errors = [
      { field: 'field1', message: 'Error 1' },
      { field: 'field2', message: 'Error 2' },
    ];
    const result = formatValidationErrors(errors);
    expect(result).toContain('Error 1');
    expect(result).toContain('Error 2');
  });

  it('should handle errors with empty messages', () => {
    const errors = [{ field: 'test', message: '' }];
    const result = formatValidationErrors(errors);
    expect(result).toBe('');
  });

  it('should preserve error order', () => {
    const errors = [
      { field: 'a', message: 'First' },
      { field: 'b', message: 'Second' },
      { field: 'c', message: 'Third' },
    ];
    const result = formatValidationErrors(errors);
    const firstIndex = result.indexOf('First');
    const secondIndex = result.indexOf('Second');
    const thirdIndex = result.indexOf('Third');
    expect(firstIndex).toBeLessThan(secondIndex);
    expect(secondIndex).toBeLessThan(thirdIndex);
  });
});
