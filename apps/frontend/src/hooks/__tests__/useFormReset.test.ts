/**
 * Tests for useFormReset hook
 *
 * Tests the form reset functionality including confirmation dialogs
 * and direct reset behavior.
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useFormReset } from '../useFormReset';

describe('useFormReset', () => {
  describe('with confirmation required (default)', () => {
    it('requestReset sets showResetConfirmation to true', () => {
      const onReset = jest.fn();
      const { result } = renderHook(() => useFormReset({ onReset }));

      expect(result.current.showResetConfirmation).toBe(false);

      act(() => {
        result.current.requestReset();
      });

      expect(result.current.showResetConfirmation).toBe(true);
      expect(onReset).not.toHaveBeenCalled();
    });

    it('confirmReset calls onReset and sets showResetConfirmation to false', () => {
      const onReset = jest.fn();
      const { result } = renderHook(() => useFormReset({ onReset }));

      // First request reset to show confirmation
      act(() => {
        result.current.requestReset();
      });

      expect(result.current.showResetConfirmation).toBe(true);

      // Then confirm the reset
      act(() => {
        result.current.confirmReset();
      });

      expect(result.current.showResetConfirmation).toBe(false);
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('cancelReset sets showResetConfirmation to false without calling onReset', () => {
      const onReset = jest.fn();
      const { result } = renderHook(() => useFormReset({ onReset }));

      // First request reset to show confirmation
      act(() => {
        result.current.requestReset();
      });

      expect(result.current.showResetConfirmation).toBe(true);

      // Then cancel the reset
      act(() => {
        result.current.cancelReset();
      });

      expect(result.current.showResetConfirmation).toBe(false);
      expect(onReset).not.toHaveBeenCalled();
    });
  });

  describe('without confirmation required', () => {
    it('calls onReset directly when requireConfirmation is false', () => {
      const onReset = jest.fn();
      const { result } = renderHook(() =>
        useFormReset({ onReset, requireConfirmation: false })
      );

      expect(result.current.showResetConfirmation).toBe(false);

      act(() => {
        result.current.requestReset();
      });

      // Should call onReset directly without showing confirmation
      expect(result.current.showResetConfirmation).toBe(false);
      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });
});
