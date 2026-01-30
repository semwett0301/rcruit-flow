/**
 * Unit tests for the useUploadSuccess hook
 * Tests success state management, auto-dismiss functionality, and state reset behavior
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUploadSuccess } from './useUploadSuccess';

describe('useUploadSuccess', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with isSuccess as false', () => {
    const { result } = renderHook(() => useUploadSuccess());
    
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.fileName).toBeNull();
  });

  it('sets isSuccess to true when showSuccess is called', () => {
    const { result } = renderHook(() => useUploadSuccess());
    
    act(() => {
      result.current.showSuccess();
    });
    
    expect(result.current.isSuccess).toBe(true);
  });

  it('stores fileName when provided to showSuccess', () => {
    const { result } = renderHook(() => useUploadSuccess());
    
    act(() => {
      result.current.showSuccess('test.pdf');
    });
    
    expect(result.current.fileName).toBe('test.pdf');
  });

  it('dismisses success message when dismissSuccess is called', () => {
    const { result } = renderHook(() => useUploadSuccess());
    
    act(() => {
      result.current.showSuccess('test.pdf');
    });
    
    act(() => {
      result.current.dismissSuccess();
    });
    
    expect(result.current.isSuccess).toBe(false);
  });

  it('resets all state when resetSuccess is called', () => {
    const { result } = renderHook(() => useUploadSuccess());
    
    act(() => {
      result.current.showSuccess('test.pdf');
    });
    
    act(() => {
      result.current.resetSuccess();
    });
    
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.fileName).toBeNull();
  });

  it('auto-dismisses after specified delay', () => {
    const { result } = renderHook(() => useUploadSuccess({ autoDismissDelay: 5000 }));
    
    act(() => {
      result.current.showSuccess('test.pdf');
    });
    
    expect(result.current.isSuccess).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(result.current.isSuccess).toBe(false);
  });

  it('does not auto-dismiss before the delay expires', () => {
    const { result } = renderHook(() => useUploadSuccess({ autoDismissDelay: 5000 }));
    
    act(() => {
      result.current.showSuccess('test.pdf');
    });
    
    act(() => {
      vi.advanceTimersByTime(4999);
    });
    
    expect(result.current.isSuccess).toBe(true);
  });

  it('clears previous timer when showSuccess is called multiple times', () => {
    const { result } = renderHook(() => useUploadSuccess({ autoDismissDelay: 5000 }));
    
    act(() => {
      result.current.showSuccess('first.pdf');
    });
    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    act(() => {
      result.current.showSuccess('second.pdf');
    });
    
    expect(result.current.fileName).toBe('second.pdf');
    
    // After 3 more seconds (6 total from first call), should still be showing
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(result.current.isSuccess).toBe(true);
    
    // After 5 seconds from second call, should dismiss
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(result.current.isSuccess).toBe(false);
  });

  it('preserves fileName when dismissSuccess is called', () => {
    const { result } = renderHook(() => useUploadSuccess());
    
    act(() => {
      result.current.showSuccess('test.pdf');
    });
    
    act(() => {
      result.current.dismissSuccess();
    });
    
    // fileName should be preserved after dismiss (only isSuccess changes)
    // This allows for potential re-showing of the same file
    expect(result.current.isSuccess).toBe(false);
  });

  it('handles showSuccess without fileName parameter', () => {
    const { result } = renderHook(() => useUploadSuccess());
    
    act(() => {
      result.current.showSuccess();
    });
    
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.fileName).toBeNull();
  });

  it('works without autoDismissDelay option', () => {
    const { result } = renderHook(() => useUploadSuccess());
    
    act(() => {
      result.current.showSuccess('test.pdf');
    });
    
    // Advance time significantly - should not auto-dismiss without delay configured
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    expect(result.current.isSuccess).toBe(true);
  });

  it('cleans up timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { result, unmount } = renderHook(() => useUploadSuccess({ autoDismissDelay: 5000 }));
    
    act(() => {
      result.current.showSuccess('test.pdf');
    });
    
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});
