/**
 * Unit tests for useUploadSuccess hook
 *
 * Tests the upload success notification state management including:
 * - Initial state
 * - Triggering success notifications
 * - Dismissing notifications
 * - Auto-dismiss timeout behavior
 * - Timer reset on multiple triggers
 */

import { renderHook, act } from '@testing-library/react';
import { useUploadSuccess } from '../useUploadSuccess';

describe('useUploadSuccess', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should have showSuccess=false and successData=null', () => {
      const { result } = renderHook(() => useUploadSuccess());

      expect(result.current.showSuccess).toBe(false);
      expect(result.current.successData).toBeNull();
    });
  });

  describe('triggerSuccess', () => {
    it('should set showSuccess=true and populate successData', () => {
      const { result } = renderHook(() => useUploadSuccess());

      const testData = {
        fileName: 'test-file.pdf',
        fileSize: 1024,
        uploadedAt: new Date().toISOString(),
      };

      act(() => {
        result.current.triggerSuccess(testData);
      });

      expect(result.current.showSuccess).toBe(true);
      expect(result.current.successData).toEqual(testData);
    });

    it('should handle different data shapes', () => {
      const { result } = renderHook(() => useUploadSuccess());

      const testData = {
        id: '123',
        message: 'Upload complete',
      };

      act(() => {
        result.current.triggerSuccess(testData);
      });

      expect(result.current.showSuccess).toBe(true);
      expect(result.current.successData).toEqual(testData);
    });
  });

  describe('dismissSuccess', () => {
    it('should reset state when called', () => {
      const { result } = renderHook(() => useUploadSuccess());

      const testData = { fileName: 'test.pdf' };

      act(() => {
        result.current.triggerSuccess(testData);
      });

      expect(result.current.showSuccess).toBe(true);
      expect(result.current.successData).toEqual(testData);

      act(() => {
        result.current.dismissSuccess();
      });

      expect(result.current.showSuccess).toBe(false);
      expect(result.current.successData).toBeNull();
    });

    it('should be safe to call when already dismissed', () => {
      const { result } = renderHook(() => useUploadSuccess());

      act(() => {
        result.current.dismissSuccess();
      });

      expect(result.current.showSuccess).toBe(false);
      expect(result.current.successData).toBeNull();
    });
  });

  describe('auto-dismiss timeout', () => {
    it('should auto-dismiss after timeout period', () => {
      const { result } = renderHook(() => useUploadSuccess());

      const testData = { fileName: 'test.pdf' };

      act(() => {
        result.current.triggerSuccess(testData);
      });

      expect(result.current.showSuccess).toBe(true);

      // Fast-forward time to trigger auto-dismiss
      act(() => {
        jest.runAllTimers();
      });

      expect(result.current.showSuccess).toBe(false);
      expect(result.current.successData).toBeNull();
    });

    it('should not auto-dismiss before timeout period', () => {
      const { result } = renderHook(() => useUploadSuccess());

      const testData = { fileName: 'test.pdf' };

      act(() => {
        result.current.triggerSuccess(testData);
      });

      expect(result.current.showSuccess).toBe(true);

      // Advance time but not enough to trigger auto-dismiss
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.showSuccess).toBe(true);
      expect(result.current.successData).toEqual(testData);
    });
  });

  describe('multiple triggers', () => {
    it('should reset the timer when triggered multiple times', () => {
      const { result } = renderHook(() => useUploadSuccess());

      const firstData = { fileName: 'first.pdf' };
      const secondData = { fileName: 'second.pdf' };

      act(() => {
        result.current.triggerSuccess(firstData);
      });

      expect(result.current.successData).toEqual(firstData);

      // Advance time partially
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Trigger again with new data - should reset timer
      act(() => {
        result.current.triggerSuccess(secondData);
      });

      expect(result.current.showSuccess).toBe(true);
      expect(result.current.successData).toEqual(secondData);

      // Advance time by the same partial amount - should still be showing
      // because timer was reset
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.showSuccess).toBe(true);
      expect(result.current.successData).toEqual(secondData);

      // Now run all remaining timers to trigger auto-dismiss
      act(() => {
        jest.runAllTimers();
      });

      expect(result.current.showSuccess).toBe(false);
      expect(result.current.successData).toBeNull();
    });

    it('should update successData on subsequent triggers', () => {
      const { result } = renderHook(() => useUploadSuccess());

      const firstData = { fileName: 'first.pdf', size: 100 };
      const secondData = { fileName: 'second.pdf', size: 200 };
      const thirdData = { fileName: 'third.pdf', size: 300 };

      act(() => {
        result.current.triggerSuccess(firstData);
      });
      expect(result.current.successData).toEqual(firstData);

      act(() => {
        result.current.triggerSuccess(secondData);
      });
      expect(result.current.successData).toEqual(secondData);

      act(() => {
        result.current.triggerSuccess(thirdData);
      });
      expect(result.current.successData).toEqual(thirdData);

      expect(result.current.showSuccess).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should clear timeout on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { result, unmount } = renderHook(() => useUploadSuccess());

      act(() => {
        result.current.triggerSuccess({ fileName: 'test.pdf' });
      });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });
});
