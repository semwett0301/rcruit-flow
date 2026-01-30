/**
 * Unit tests for useCandidateEmail hook
 * Tests email state management, validation, and modification tracking
 */
import { renderHook, act } from '@testing-library/react';
import { useCandidateEmail } from '../useCandidateEmail';

describe('useCandidateEmail', () => {
  it('initializes with provided email', () => {
    const { result } = renderHook(() => useCandidateEmail('test@example.com'));
    expect(result.current.email).toBe('test@example.com');
    expect(result.current.isEmailValid).toBe(true);
    expect(result.current.isEmailModified).toBe(false);
  });

  it('updates email and validation state', () => {
    const { result } = renderHook(() => useCandidateEmail('test@example.com'));
    
    act(() => {
      result.current.setEmail('new@example.com');
    });

    expect(result.current.email).toBe('new@example.com');
    expect(result.current.isEmailValid).toBe(true);
    expect(result.current.isEmailModified).toBe(true);
  });

  it('marks invalid email as invalid', () => {
    const { result } = renderHook(() => useCandidateEmail('test@example.com'));
    
    act(() => {
      result.current.setEmail('invalid');
    });

    expect(result.current.isEmailValid).toBe(false);
  });

  it('resets email to new original', () => {
    const { result } = renderHook(() => useCandidateEmail('test@example.com'));
    
    act(() => {
      result.current.setEmail('modified@example.com');
    });
    expect(result.current.isEmailModified).toBe(true);

    act(() => {
      result.current.resetEmail('reset@example.com');
    });
    expect(result.current.email).toBe('reset@example.com');
    expect(result.current.isEmailModified).toBe(false);
  });

  it('initializes with empty email', () => {
    const { result } = renderHook(() => useCandidateEmail(''));
    expect(result.current.email).toBe('');
    expect(result.current.isEmailValid).toBe(false);
    expect(result.current.isEmailModified).toBe(false);
  });

  it('validates various email formats correctly', () => {
    const { result } = renderHook(() => useCandidateEmail('test@example.com'));
    
    // Test email without domain extension
    act(() => {
      result.current.setEmail('test@example');
    });
    expect(result.current.isEmailValid).toBe(false);

    // Test email without @ symbol
    act(() => {
      result.current.setEmail('testexample.com');
    });
    expect(result.current.isEmailValid).toBe(false);

    // Test valid email with subdomain
    act(() => {
      result.current.setEmail('test@mail.example.com');
    });
    expect(result.current.isEmailValid).toBe(true);

    // Test valid email with plus sign
    act(() => {
      result.current.setEmail('test+tag@example.com');
    });
    expect(result.current.isEmailValid).toBe(true);
  });

  it('tracks modification correctly when setting same email', () => {
    const { result } = renderHook(() => useCandidateEmail('test@example.com'));
    
    act(() => {
      result.current.setEmail('test@example.com');
    });

    expect(result.current.isEmailModified).toBe(false);
  });

  it('handles reset without prior modification', () => {
    const { result } = renderHook(() => useCandidateEmail('test@example.com'));
    
    act(() => {
      result.current.resetEmail('new@example.com');
    });

    expect(result.current.email).toBe('new@example.com');
    expect(result.current.isEmailModified).toBe(false);
  });
});
