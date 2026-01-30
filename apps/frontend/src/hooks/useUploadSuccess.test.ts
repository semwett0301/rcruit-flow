/**
 * Unit tests for useUploadSuccess hook
 * Tests the upload success notification state management
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUploadSuccess } from './useUploadSuccess';

describe('useUploadSuccess', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should have initial state with showSuccess as false', () => {
    const { result } = renderHook(() => useUploadSuccess());

    expect(result.current.showSuccess).toBe(false);
    expect(result.current.fileName).toBeUndefined();
  });

  it('should set showSuccess to true and store fileName when triggerSuccess is called', () => {
    const { result } = renderHook(() => useUploadSuccess());

    act(() => {
      result.current.triggerSuccess('test-file.pdf');
    });

    expect(result.current.showSuccess).toBe(true);
    expect(result.current.fileName).toBe('test-file.pdf');
  });

  it('should set showSuccess to false when dismissSuccess is called', () => {
    const { result } = renderHook(() => useUploadSuccess());

    act(() => {
      result.current.triggerSuccess('test-file.pdf');
    });

    expect(result.current.showSuccess).toBe(true);

    act(() => {
      result.current.dismissSuccess();
    });

    expect(result.current.showSuccess).toBe(false);
  });

  it('should auto-dismiss after specified delay', () => {
    const customDelay = 2000;
    const { result } = renderHook(() => useUploadSuccess(customDelay));

    act(() => {
      result.current.triggerSuccess('test-file.pdf');
    });

    expect(result.current.showSuccess).toBe(true);

    // Advance time but not enough to trigger auto-dismiss
    act(() => {
      jest.advanceTimersByTime(customDelay - 100);
    });

    expect(result.current.showSuccess).toBe(true);

    // Advance time to trigger auto-dismiss
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.showSuccess).toBe(false);
  });

  it('should use default delay when not specified', () => {
    const defaultDelay = 3000; // Assuming default is 3000ms
    const { result } = renderHook(() => useUploadSuccess());

    act(() => {
      result.current.triggerSuccess('test-file.pdf');
    });

    expect(result.current.showSuccess).toBe(true);

    // Advance time but not enough for default delay
    act(() => {
      jest.advanceTimersByTime(defaultDelay - 100);
    });

    expect(result.current.showSuccess).toBe(true);

    // Advance time to trigger auto-dismiss with default delay
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.showSuccess).toBe(false);
  });

  it('should clean up timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { result, unmount } = renderHook(() => useUploadSuccess());

    act(() => {
      result.current.triggerSuccess('test-file.pdf');
    });

    expect(result.current.showSuccess).toBe(true);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it('should clear previous timeout when triggerSuccess is called multiple times', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { result } = renderHook(() => useUploadSuccess(3000));

    act(() => {
      result.current.triggerSuccess('first-file.pdf');
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.triggerSuccess('second-file.pdf');
    });

    // Should have cleared the previous timeout
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(result.current.fileName).toBe('second-file.pdf');

    // Advance time - should still be showing because timer was reset
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(result.current.showSuccess).toBe(true);

    // Now it should auto-dismiss
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.showSuccess).toBe(false);

    clearTimeoutSpy.mockRestore();
  });
});
