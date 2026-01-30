/**
 * Unit tests for the useEmailGeneration hook
 * Tests loading states, error handling, callbacks, and duplicate request prevention
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useEmailGeneration } from './useEmailGeneration';

describe('useEmailGeneration', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useEmailGeneration());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets loading state when generating email', async () => {
    (global.fetch as any).mockImplementation(() => 
      new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100))
    );

    const { result } = renderHook(() => useEmailGeneration());

    act(() => {
      result.current.generateEmail({ candidateId: '123' });
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('prevents duplicate requests while loading', async () => {
    (global.fetch as any).mockImplementation(() => 
      new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100))
    );

    const { result } = renderHook(() => useEmailGeneration());

    act(() => {
      result.current.generateEmail({ candidateId: '123' });
      result.current.generateEmail({ candidateId: '456' });
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles error state correctly', async () => {
    (global.fetch as any).mockResolvedValue({ ok: false, statusText: 'Server Error' });

    const onError = vi.fn();
    const { result } = renderHook(() => useEmailGeneration({ onError }));

    await act(async () => {
      await result.current.generateEmail({ candidateId: '123' });
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.isLoading).toBe(false);
    expect(onError).toHaveBeenCalled();
  });

  it('clears error when clearError is called', async () => {
    (global.fetch as any).mockResolvedValue({ ok: false, statusText: 'Server Error' });

    const { result } = renderHook(() => useEmailGeneration());

    await act(async () => {
      await result.current.generateEmail({ candidateId: '123' });
    });

    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('calls onSuccess callback on successful generation', async () => {
    const mockResult = { email: 'test@example.com' };
    (global.fetch as any).mockResolvedValue({ ok: true, json: () => mockResult });

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useEmailGeneration({ onSuccess }));

    await act(async () => {
      await result.current.generateEmail({ candidateId: '123' });
    });

    expect(onSuccess).toHaveBeenCalledWith(mockResult);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('resets loading state after successful request', async () => {
    const mockResult = { email: 'test@example.com' };
    (global.fetch as any).mockResolvedValue({ ok: true, json: () => mockResult });

    const { result } = renderHook(() => useEmailGeneration());

    await act(async () => {
      await result.current.generateEmail({ candidateId: '123' });
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('handles network errors gracefully', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    const onError = vi.fn();
    const { result } = renderHook(() => useEmailGeneration({ onError }));

    await act(async () => {
      await result.current.generateEmail({ candidateId: '123' });
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.isLoading).toBe(false);
    expect(onError).toHaveBeenCalled();
  });

  it('allows new request after previous request completes', async () => {
    const mockResult = { email: 'test@example.com' };
    (global.fetch as any).mockResolvedValue({ ok: true, json: () => mockResult });

    const { result } = renderHook(() => useEmailGeneration());

    await act(async () => {
      await result.current.generateEmail({ candidateId: '123' });
    });

    await act(async () => {
      await result.current.generateEmail({ candidateId: '456' });
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
