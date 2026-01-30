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

  it('should set error when clipboard fails', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(
      new Error('Failed')
    );

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('should set error when text is empty', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard('');
    });

    expect(result.current.error).toBe('No text to copy');
  });

  it('should reset state after delay', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useClipboard(1000));

    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe(false);
    jest.useRealTimers();
  });

  it('should reset state manually', async () => {
    const { result } = renderHook(() => useClipboard(0));

    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.copied).toBe(false);
  });

  it('should handle multiple copy operations', async () => {
    const { result } = renderHook(() => useClipboard(0));

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
  });

  it('should clear previous error on successful copy', async () => {
    const { result } = renderHook(() => useClipboard(0));

    // First, trigger an error
    await act(async () => {
      await result.current.copyToClipboard('');
    });

    expect(result.current.error).toBe('No text to copy');

    // Then, perform a successful copy
    await act(async () => {
      await result.current.copyToClipboard('valid text');
    });

    expect(result.current.error).toBeNull();
    expect(result.current.copied).toBe(true);
  });

  it('should handle whitespace-only text', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard('   ');
    });

    // Whitespace-only text should still be copied (not treated as empty)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('   ');
    expect(result.current.copied).toBe(true);
  });
});
