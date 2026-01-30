/**
 * Unit tests for useEmailGenerationValidation hook
 * Tests validation logic for email generation form data
 */
import { renderHook, act } from '@testing-library/react';
import { useEmailGenerationValidation } from '../useEmailGenerationValidation';

describe('useEmailGenerationValidation', () => {
  describe('initialization', () => {
    it('should initialize with null validation result', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      expect(result.current.validationResult).toBeNull();
      expect(result.current.hasErrors).toBe(false);
    });
  });

  describe('validate', () => {
    it('should validate and return errors for missing candidate data', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      act(() => {
        result.current.validate(null, { title: 'Dev', description: 'Code' });
      });

      expect(result.current.hasErrors).toBe(true);
      expect(result.current.validationResult?.errors.length).toBeGreaterThan(0);
    });

    it('should validate and return errors for missing job data', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      act(() => {
        result.current.validate({ name: 'John', email: 'john@test.com' }, null);
      });

      expect(result.current.hasErrors).toBe(true);
      expect(result.current.validationResult?.errors.length).toBeGreaterThan(0);
    });

    it('should validate and return errors for both missing data', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      act(() => {
        result.current.validate(null, null);
      });

      expect(result.current.hasErrors).toBe(true);
      expect(result.current.validationResult?.errors.length).toBeGreaterThan(0);
    });

    it('should return no errors for valid data', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      act(() => {
        result.current.validate(
          { name: 'John', email: 'john@test.com' },
          { title: 'Dev', description: 'Code' }
        );
      });

      expect(result.current.hasErrors).toBe(false);
      expect(result.current.validationResult?.isValid).toBe(true);
    });

    it('should return errors for empty candidate name', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      act(() => {
        result.current.validate(
          { name: '', email: 'john@test.com' },
          { title: 'Dev', description: 'Code' }
        );
      });

      expect(result.current.hasErrors).toBe(true);
    });

    it('should return errors for invalid email format', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      act(() => {
        result.current.validate(
          { name: 'John', email: 'invalid-email' },
          { title: 'Dev', description: 'Code' }
        );
      });

      expect(result.current.hasErrors).toBe(true);
    });

    it('should return errors for empty job title', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      act(() => {
        result.current.validate(
          { name: 'John', email: 'john@test.com' },
          { title: '', description: 'Code' }
        );
      });

      expect(result.current.hasErrors).toBe(true);
    });
  });

  describe('clearValidation', () => {
    it('should clear validation state after errors', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      // First, trigger validation errors
      act(() => {
        result.current.validate(null, null);
      });
      expect(result.current.hasErrors).toBe(true);

      // Then clear validation
      act(() => {
        result.current.clearValidation();
      });
      
      expect(result.current.validationResult).toBeNull();
      expect(result.current.hasErrors).toBe(false);
    });

    it('should clear validation state after successful validation', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      // First, trigger successful validation
      act(() => {
        result.current.validate(
          { name: 'John', email: 'john@test.com' },
          { title: 'Dev', description: 'Code' }
        );
      });
      expect(result.current.validationResult).not.toBeNull();

      // Then clear validation
      act(() => {
        result.current.clearValidation();
      });
      
      expect(result.current.validationResult).toBeNull();
      expect(result.current.hasErrors).toBe(false);
    });
  });

  describe('getFieldError', () => {
    it('should get field-specific error for candidateData', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      act(() => {
        result.current.validate(null, { title: 'Dev', description: 'Code' });
      });

      const error = result.current.getFieldError('candidateData');
      expect(error).toBeDefined();
    });

    it('should get field-specific error for jobData', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      act(() => {
        result.current.validate({ name: 'John', email: 'john@test.com' }, null);
      });

      const error = result.current.getFieldError('jobData');
      expect(error).toBeDefined();
    });

    it('should return undefined for field without error', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      act(() => {
        result.current.validate(
          { name: 'John', email: 'john@test.com' },
          { title: 'Dev', description: 'Code' }
        );
      });

      const error = result.current.getFieldError('candidateData');
      expect(error).toBeUndefined();
    });

    it('should return undefined when no validation has been performed', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());

      const error = result.current.getFieldError('candidateData');
      expect(error).toBeUndefined();
    });
  });

  describe('re-validation', () => {
    it('should update validation result on re-validation', () => {
      const { result } = renderHook(() => useEmailGenerationValidation());
      
      // First validation with errors
      act(() => {
        result.current.validate(null, null);
      });
      expect(result.current.hasErrors).toBe(true);

      // Re-validate with valid data
      act(() => {
        result.current.validate(
          { name: 'John', email: 'john@test.com' },
          { title: 'Dev', description: 'Code' }
        );
      });
      
      expect(result.current.hasErrors).toBe(false);
      expect(result.current.validationResult?.isValid).toBe(true);
    });
  });
});
