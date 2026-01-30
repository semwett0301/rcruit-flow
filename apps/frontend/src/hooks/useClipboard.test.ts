/**
 * Unit tests for the useClipboard hook
 * Tests clipboard functionality including copy, error handling, and state management
 */
import { renderHook, act } from '@testing-library/react';
import { useClipboard } from './useClipboard';

describe('useClipboard', () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    // Mock the clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    // Restore original clipboard
    Object.assign(navigator, { clipboard: originalClipboard });
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useClipboard());
    
    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should copy text to clipboard successfully', async () => {
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle clipboard API failure', async () => {
    const mockError = new Error('Failed to copy');
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('should reset copied state after delay', async () => {
    jest.useFakeTimers();
    const resetDelay = 1000;
    const { result } = renderHook(() => useClipboard(resetDelay));
    
    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(resetDelay);
    });

    expect(result.current.copied).toBe(false);
    
    jest.useRealTimers();
  });

  it('should reset state manually', async () => {
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle empty string copy', async () => {
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      await result.current.copyToClipboard('');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
    expect(result.current.copied).toBe(true);
  });

  it('should handle multiple consecutive copies', async () => {
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      await result.current.copyToClipboard('first text');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('first text');
    expect(result.current.copied).toBe(true);

    await act(async () => {
      await result.current.copyToClipboard('second text');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('second text');
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2);
    expect(result.current.copied).toBe(true);
  });

  it('should clear error on successful copy after failure', async () => {
    const mockError = new Error('Failed to copy');
    (navigator.clipboard.writeText as jest.Mock)
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useClipboard());
    
    // First copy fails
    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.copied).toBe(false);

    // Second copy succeeds
    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.error).toBeNull();
    expect(result.current.copied).toBe(true);
  });

  it('should use custom reset delay', async () => {
    jest.useFakeTimers();
    const customDelay = 2000;
    const { result } = renderHook(() => useClipboard(customDelay));
    
    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(true);

    // Advance by less than the delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should still be copied
    expect(result.current.copied).toBe(true);

    // Advance to complete the delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe(false);
    
    jest.useRealTimers();
  });
});
