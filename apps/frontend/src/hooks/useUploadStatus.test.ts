/**
 * Unit tests for useUploadStatus hook
 * Tests all state transitions and status management functionality
 */
import { renderHook, act } from '@testing-library/react';
import { useUploadStatus } from './useUploadStatus';

describe('useUploadStatus', () => {
  describe('initial state', () => {
    it('should have idle status with no fileName or error', () => {
      const { result } = renderHook(() => useUploadStatus());

      expect(result.current.status).toBe('idle');
      expect(result.current.fileName).toBeUndefined();
      expect(result.current.errorMessage).toBeUndefined();
    });
  });

  describe('setUploading', () => {
    it('should set status to uploading', () => {
      const { result } = renderHook(() => useUploadStatus());

      act(() => {
        result.current.setUploading();
      });

      expect(result.current.status).toBe('uploading');
    });
  });

  describe('setSuccess', () => {
    it('should set status to success and store fileName', () => {
      const { result } = renderHook(() => useUploadStatus());
      const testFileName = 'test-document.pdf';

      act(() => {
        result.current.setSuccess(testFileName);
      });

      expect(result.current.status).toBe('success');
      expect(result.current.fileName).toBe(testFileName);
    });
  });

  describe('setProcessing', () => {
    it('should set status to processing and store fileName', () => {
      const { result } = renderHook(() => useUploadStatus());
      const testFileName = 'processing-file.pdf';

      act(() => {
        result.current.setProcessing(testFileName);
      });

      expect(result.current.status).toBe('processing');
      expect(result.current.fileName).toBe(testFileName);
    });
  });

  describe('setError', () => {
    it('should set status to error and store errorMessage', () => {
      const { result } = renderHook(() => useUploadStatus());
      const testErrorMessage = 'Upload failed: file too large';

      act(() => {
        result.current.setError(testErrorMessage);
      });

      expect(result.current.status).toBe('error');
      expect(result.current.errorMessage).toBe(testErrorMessage);
    });
  });

  describe('reset', () => {
    it('should return state to idle and clear fileName', () => {
      const { result } = renderHook(() => useUploadStatus());

      // First set a success state with fileName
      act(() => {
        result.current.setSuccess('some-file.pdf');
      });

      expect(result.current.status).toBe('success');
      expect(result.current.fileName).toBe('some-file.pdf');

      // Then reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.fileName).toBeUndefined();
      expect(result.current.errorMessage).toBeUndefined();
    });

    it('should return state to idle and clear errorMessage', () => {
      const { result } = renderHook(() => useUploadStatus());

      // First set an error state
      act(() => {
        result.current.setError('Some error occurred');
      });

      expect(result.current.status).toBe('error');
      expect(result.current.errorMessage).toBe('Some error occurred');

      // Then reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.fileName).toBeUndefined();
      expect(result.current.errorMessage).toBeUndefined();
    });
  });

  describe('state transitions', () => {
    it('should handle complete upload flow: idle -> uploading -> processing -> success', () => {
      const { result } = renderHook(() => useUploadStatus());
      const testFileName = 'workflow-test.pdf';

      // Initial state
      expect(result.current.status).toBe('idle');

      // Start uploading
      act(() => {
        result.current.setUploading();
      });
      expect(result.current.status).toBe('uploading');

      // Processing
      act(() => {
        result.current.setProcessing(testFileName);
      });
      expect(result.current.status).toBe('processing');
      expect(result.current.fileName).toBe(testFileName);

      // Success
      act(() => {
        result.current.setSuccess(testFileName);
      });
      expect(result.current.status).toBe('success');
      expect(result.current.fileName).toBe(testFileName);
    });

    it('should handle upload error flow: idle -> uploading -> error -> reset -> idle', () => {
      const { result } = renderHook(() => useUploadStatus());
      const testErrorMessage = 'Network error';

      // Initial state
      expect(result.current.status).toBe('idle');

      // Start uploading
      act(() => {
        result.current.setUploading();
      });
      expect(result.current.status).toBe('uploading');

      // Error occurs
      act(() => {
        result.current.setError(testErrorMessage);
      });
      expect(result.current.status).toBe('error');
      expect(result.current.errorMessage).toBe(testErrorMessage);

      // Reset to try again
      act(() => {
        result.current.reset();
      });
      expect(result.current.status).toBe('idle');
      expect(result.current.errorMessage).toBeUndefined();
    });

    it('should allow transitioning from success back to uploading for new upload', () => {
      const { result } = renderHook(() => useUploadStatus());

      // Complete first upload
      act(() => {
        result.current.setSuccess('first-file.pdf');
      });
      expect(result.current.status).toBe('success');
      expect(result.current.fileName).toBe('first-file.pdf');

      // Start new upload
      act(() => {
        result.current.setUploading();
      });
      expect(result.current.status).toBe('uploading');

      // Complete second upload
      act(() => {
        result.current.setSuccess('second-file.pdf');
      });
      expect(result.current.status).toBe('success');
      expect(result.current.fileName).toBe('second-file.pdf');
    });
  });
});
