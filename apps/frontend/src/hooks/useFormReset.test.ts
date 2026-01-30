/**
 * Unit tests for the useFormReset hook
 * Tests the form reset confirmation dialog state management
 */
import { renderHook, act } from '@testing-library/react';
import { useFormReset } from './useFormReset';

describe('useFormReset', () => {
  describe('initial state', () => {
    it('should have isConfirmOpen as false initially', () => {
      const mockOnReset = jest.fn();
      const { result } = renderHook(() => useFormReset(mockOnReset));

      expect(result.current.isConfirmOpen).toBe(false);
    });
  });

  describe('openConfirmDialog', () => {
    it('should set isConfirmOpen to true when called', () => {
      const mockOnReset = jest.fn();
      const { result } = renderHook(() => useFormReset(mockOnReset));

      act(() => {
        result.current.openConfirmDialog();
      });

      expect(result.current.isConfirmOpen).toBe(true);
    });
  });

  describe('closeConfirmDialog', () => {
    it('should set isConfirmOpen to false when called', () => {
      const mockOnReset = jest.fn();
      const { result } = renderHook(() => useFormReset(mockOnReset));

      // First open the dialog
      act(() => {
        result.current.openConfirmDialog();
      });

      expect(result.current.isConfirmOpen).toBe(true);

      // Then close it
      act(() => {
        result.current.closeConfirmDialog();
      });

      expect(result.current.isConfirmOpen).toBe(false);
    });
  });

  describe('confirmReset', () => {
    it('should call onReset callback when confirmed', () => {
      const mockOnReset = jest.fn();
      const { result } = renderHook(() => useFormReset(mockOnReset));

      act(() => {
        result.current.confirmReset();
      });

      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    it('should close the dialog after confirming reset', () => {
      const mockOnReset = jest.fn();
      const { result } = renderHook(() => useFormReset(mockOnReset));

      // Open the dialog first
      act(() => {
        result.current.openConfirmDialog();
      });

      expect(result.current.isConfirmOpen).toBe(true);

      // Confirm reset
      act(() => {
        result.current.confirmReset();
      });

      expect(result.current.isConfirmOpen).toBe(false);
    });

    it('should call onReset callback and close dialog in sequence', () => {
      const mockOnReset = jest.fn();
      const { result } = renderHook(() => useFormReset(mockOnReset));

      // Open dialog
      act(() => {
        result.current.openConfirmDialog();
      });

      // Confirm reset
      act(() => {
        result.current.confirmReset();
      });

      expect(mockOnReset).toHaveBeenCalledTimes(1);
      expect(result.current.isConfirmOpen).toBe(false);
    });
  });
});
