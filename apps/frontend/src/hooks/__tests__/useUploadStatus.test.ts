/**
 * Unit tests for useUploadStatus hook
 * Tests upload status state management including idle, uploading, success, and error states
 */

import { renderHook, act } from '@testing-library/react';
import { useUploadStatus } from '../useUploadStatus';

describe('useUploadStatus', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should have initial status of idle', () => {
    const { result } = renderHook(() => useUploadStatus());

    expect(result.current.status).toBe('idle');
    expect(result.current.fileName).toBeUndefined();
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('should change status to uploading when setUploading is called', () => {
    const { result } = renderHook(() => useUploadStatus());

    act(() => {
      result.current.setUploading();
    });

    expect(result.current.status).toBe('uploading');
  });

  it('should change status to success and store fileName when setSuccess is called', () => {
    const { result } = renderHook(() => useUploadStatus());
    const testFileName = 'test-document.pdf';

    act(() => {
      result.current.setSuccess(testFileName);
    });

    expect(result.current.status).toBe('success');
    expect(result.current.fileName).toBe(testFileName);
  });

  it('should change status to error and store message when setError is called', () => {
    const { result } = renderHook(() => useUploadStatus());
    const testErrorMessage = 'Upload failed: file too large';

    act(() => {
      result.current.setError(testErrorMessage);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe(testErrorMessage);
  });

  it('should return to idle state when reset is called', () => {
    const { result } = renderHook(() => useUploadStatus());

    // First set to success state
    act(() => {
      result.current.setSuccess('test-file.pdf');
    });

    expect(result.current.status).toBe('success');

    // Then reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.fileName).toBeUndefined();
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('should reset from error state when reset is called', () => {
    const { result } = renderHook(() => useUploadStatus());

    // First set to error state
    act(() => {
      result.current.setError('Some error');
    });

    expect(result.current.status).toBe('error');

    // Then reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('should auto-dismiss success status after timeout', () => {
    const { result } = renderHook(() => useUploadStatus());

    act(() => {
      result.current.setSuccess('test-file.pdf');
    });

    expect(result.current.status).toBe('success');

    // Fast-forward time to trigger auto-dismiss
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.status).toBe('idle');
  });

  it('should auto-dismiss error status after timeout', () => {
    const { result } = renderHook(() => useUploadStatus());

    act(() => {
      result.current.setError('Upload failed');
    });

    expect(result.current.status).toBe('error');

    // Fast-forward time to trigger auto-dismiss
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.status).toBe('idle');
  });

  it('should clear previous timer when setting new status', () => {
    const { result } = renderHook(() => useUploadStatus());

    act(() => {
      result.current.setSuccess('first-file.pdf');
    });

    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Set new success before timer completes
    act(() => {
      result.current.setSuccess('second-file.pdf');
    });

    expect(result.current.status).toBe('success');
    expect(result.current.fileName).toBe('second-file.pdf');

    // Complete the new timer
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.status).toBe('idle');
  });
});
