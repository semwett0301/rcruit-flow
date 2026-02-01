/**
 * Unit tests for CV upload error handler utility
 * Tests error handling for various upload failure scenarios
 */
import { describe, it, expect } from 'vitest';
import { handleCvUploadError } from '../cv-upload-error-handler';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

describe('handleCvUploadError', () => {
  describe('API error responses with known error codes', () => {
    it('should handle INVALID_FILE_TYPE error code', () => {
      const apiError = { code: CvUploadErrorCode.INVALID_FILE_TYPE, message: 'Invalid type' };

      const result = handleCvUploadError(apiError);

      expect(result.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
      expect(result.title).toBe('Unsupported File Format');
    });

    it('should handle FILE_SIZE_EXCEEDED error code', () => {
      const apiError = { code: CvUploadErrorCode.FILE_SIZE_EXCEEDED, message: 'File too large' };

      const result = handleCvUploadError(apiError);

      expect(result.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
    });

    it('should handle SERVER_ERROR error code', () => {
      const apiError = { code: CvUploadErrorCode.SERVER_ERROR, message: 'Server error' };

      const result = handleCvUploadError(apiError);

      expect(result.code).toBe(CvUploadErrorCode.SERVER_ERROR);
    });
  });

  describe('HTTP status code handling', () => {
    it('should handle 500 server errors', () => {
      const error = { response: { status: 500 } };

      const result = handleCvUploadError(error);

      expect(result.code).toBe(CvUploadErrorCode.SERVER_ERROR);
    });

    it('should handle 413 payload too large errors', () => {
      const error = { response: { status: 413 } };

      const result = handleCvUploadError(error);

      expect(result.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
    });

    it('should handle 415 unsupported media type errors', () => {
      const error = { response: { status: 415 } };

      const result = handleCvUploadError(error);

      expect(result.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
    });

    it('should handle 502 bad gateway errors as server errors', () => {
      const error = { response: { status: 502 } };

      const result = handleCvUploadError(error);

      expect(result.code).toBe(CvUploadErrorCode.SERVER_ERROR);
    });

    it('should handle 503 service unavailable errors as server errors', () => {
      const error = { response: { status: 503 } };

      const result = handleCvUploadError(error);

      expect(result.code).toBe(CvUploadErrorCode.SERVER_ERROR);
    });
  });

  describe('network error handling', () => {
    it('should handle TypeError with "Failed to fetch" message', () => {
      const error = new TypeError('Failed to fetch');

      const result = handleCvUploadError(error);

      expect(result.code).toBe(CvUploadErrorCode.NETWORK_ERROR);
    });

    it('should handle TypeError with "Network request failed" message', () => {
      const error = new TypeError('Network request failed');

      const result = handleCvUploadError(error);

      expect(result.code).toBe(CvUploadErrorCode.NETWORK_ERROR);
    });

    it('should handle generic network error objects', () => {
      const error = { message: 'Network Error' };

      const result = handleCvUploadError(error);

      expect(result.code).toBe(CvUploadErrorCode.NETWORK_ERROR);
    });
  });

  describe('unknown error handling', () => {
    it('should return UNKNOWN_ERROR for unrecognized errors', () => {
      const error = { someRandomProperty: 'value' };

      const result = handleCvUploadError(error);

      expect(result.code).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
    });

    it('should return UNKNOWN_ERROR for null input', () => {
      const result = handleCvUploadError(null);

      expect(result.code).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
    });

    it('should return UNKNOWN_ERROR for undefined input', () => {
      const result = handleCvUploadError(undefined);

      expect(result.code).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
    });

    it('should return UNKNOWN_ERROR for empty object', () => {
      const result = handleCvUploadError({});

      expect(result.code).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
    });
  });

  describe('actionable guidance', () => {
    it('should include actionable guidance in all error messages', () => {
      const errorCodes = Object.values(CvUploadErrorCode);

      errorCodes.forEach((code) => {
        const result = handleCvUploadError({ code, message: 'test' });

        expect(result.action).toBeTruthy();
        expect(result.action.length).toBeGreaterThan(0);
      });
    });

    it('should have a title for all error types', () => {
      const errorCodes = Object.values(CvUploadErrorCode);

      errorCodes.forEach((code) => {
        const result = handleCvUploadError({ code, message: 'test' });

        expect(result.title).toBeTruthy();
        expect(result.title.length).toBeGreaterThan(0);
      });
    });

    it('should have a message for all error types', () => {
      const errorCodes = Object.values(CvUploadErrorCode);

      errorCodes.forEach((code) => {
        const result = handleCvUploadError({ code, message: 'test' });

        expect(result.message).toBeTruthy();
        expect(result.message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('error result structure', () => {
    it('should return an object with code, title, message, and action properties', () => {
      const error = { code: CvUploadErrorCode.INVALID_FILE_TYPE, message: 'test' };

      const result = handleCvUploadError(error);

      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('action');
    });

    it('should preserve the original error code when provided', () => {
      const error = { code: CvUploadErrorCode.FILE_SIZE_EXCEEDED, message: 'Custom message' };

      const result = handleCvUploadError(error);

      expect(result.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
    });
  });
});
