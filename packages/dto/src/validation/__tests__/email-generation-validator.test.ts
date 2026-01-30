/**
 * Unit tests for the email generation validator
 * Tests validation of email generation input and error formatting
 */
import { validateEmailGenerationInput, formatValidationErrors } from '../email-generation-validator';
import { EmailGenerationInput } from '../email-generation-validation';

describe('validateEmailGenerationInput', () => {
  it('should return valid when all required fields are present', () => {
    const input: EmailGenerationInput = {
      candidateData: { name: 'John Doe', email: 'john@example.com' },
      jobDescription: 'Software Engineer position',
    };
    const result = validateEmailGenerationInput(input);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return error when candidate data is null', () => {
    const input: EmailGenerationInput = {
      candidateData: null,
      jobDescription: 'Software Engineer position',
    };
    const result = validateEmailGenerationInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ field: 'candidateData' }));
  });

  it('should return error when job description is empty', () => {
    const input: EmailGenerationInput = {
      candidateData: { name: 'John Doe', email: 'john@example.com' },
      jobDescription: '',
    };
    const result = validateEmailGenerationInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ field: 'jobDescription' }));
  });

  it('should return multiple errors when multiple fields are missing', () => {
    const input: EmailGenerationInput = {
      candidateData: null,
      jobDescription: null,
    };
    const result = validateEmailGenerationInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it('should return error when candidate name is empty', () => {
    const input: EmailGenerationInput = {
      candidateData: { name: '', email: 'john@example.com' },
      jobDescription: 'Software Engineer position',
    };
    const result = validateEmailGenerationInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ field: 'candidateData.name' }));
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
});
