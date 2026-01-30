/**
 * Unit tests for the useUploadStatus hook
 * Tests all state transitions and derived boolean values
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUploadStatus } from './useUploadStatus';

describe('useUploadStatus', () => {
  it('initializes with idle status', () => {
    const { result } = renderHook(() => useUploadStatus());
    
    expect(result.current.uploadState.status).toBe('idle');
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('sets uploading state correctly', () => {
    const { result } = renderHook(() => useUploadStatus());
    
    act(() => {
      result.current.setUploading('test.pdf');
    });
    
    expect(result.current.uploadState.status).toBe('uploading');
    expect(result.current.uploadState.fileName).toBe('test.pdf');
    expect(result.current.isUploading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('sets success state correctly', () => {
    const { result } = renderHook(() => useUploadStatus());
    
    act(() => {
      result.current.setSuccess('test.pdf');
    });
    
    expect(result.current.uploadState.status).toBe('success');
    expect(result.current.uploadState.fileName).toBe('test.pdf');
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('sets error state correctly', () => {
    const { result } = renderHook(() => useUploadStatus());
    
    act(() => {
      result.current.setError('Upload failed');
    });
    
    expect(result.current.uploadState.status).toBe('error');
    expect(result.current.uploadState.errorMessage).toBe('Upload failed');
    expect(result.current.isError).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isUploading).toBe(false);
  });

  it('resets state correctly', () => {
    const { result } = renderHook(() => useUploadStatus());
    
    // First set a non-idle state
    act(() => {
      result.current.setSuccess('test.pdf');
    });
    
    // Verify we're in success state
    expect(result.current.uploadState.status).toBe('success');
    
    // Reset
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.uploadState.status).toBe('idle');
    expect(result.current.uploadState.fileName).toBeNull();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('transitions from uploading to success', () => {
    const { result } = renderHook(() => useUploadStatus());
    
    act(() => {
      result.current.setUploading('document.pdf');
    });
    
    expect(result.current.isUploading).toBe(true);
    
    act(() => {
      result.current.setSuccess('document.pdf');
    });
    
    expect(result.current.isUploading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.uploadState.fileName).toBe('document.pdf');
  });

  it('transitions from uploading to error', () => {
    const { result } = renderHook(() => useUploadStatus());
    
    act(() => {
      result.current.setUploading('document.pdf');
    });
    
    expect(result.current.isUploading).toBe(true);
    
    act(() => {
      result.current.setError('Network error');
    });
    
    expect(result.current.isUploading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.uploadState.errorMessage).toBe('Network error');
  });

  it('can reset from error state', () => {
    const { result } = renderHook(() => useUploadStatus());
    
    act(() => {
      result.current.setError('Something went wrong');
    });
    
    expect(result.current.isError).toBe(true);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.uploadState.status).toBe('idle');
    expect(result.current.uploadState.errorMessage).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });
});
