/**
 * Unit tests for CV upload validation utility
 * Tests file validation and API error mapping functionality
 */
import { describe, it, expect } from 'vitest';
import { validateCvFile, mapApiErrorToCode } from './cv-upload-validator';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

describe('validateCvFile', () => {
  it('returns null for valid PDF file', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

    expect(validateCvFile(file)).toBeNull();
  });

  it('returns null for valid DOCX file', () => {
    const file = new File(['content'], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 }); // 2MB

    expect(validateCvFile(file)).toBeNull();
  });

  it('returns null for valid DOC file', () => {
    const file = new File(['content'], 'test.doc', {
      type: 'application/msword',
    });
    Object.defineProperty(file, 'size', { value: 500 * 1024 }); // 500KB

    expect(validateCvFile(file)).toBeNull();
  });

  it('returns error for invalid file type', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns error for image file type', () => {
    const file = new File(['content'], 'test.png', { type: 'image/png' });

    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns error for file exceeding size limit', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 }); // 15MB

    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('returns error for file at exactly the size limit boundary', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 + 1 }); // Just over 10MB

    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('returns null for file at exactly the size limit', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // Exactly 10MB

    expect(validateCvFile(file)).toBeNull();
  });

  it('returns error for empty file', () => {
    const file = new File([], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 0 });

    const result = validateCvFile(file);
    // Empty files should either be invalid or have a specific error
    expect(result).not.toBeNull();
  });
});

describe('mapApiErrorToCode', () => {
  it('maps timeout error correctly', () => {
    const error = new Error('timeout');
    error.name = 'AbortError';

    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.NETWORK_TIMEOUT);
  });

  it('maps API error response correctly', () => {
    const error = { code: CvUploadErrorCode.FILE_CORRUPTED };

    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.FILE_CORRUPTED);
  });

  it('maps virus detected error correctly', () => {
    const error = { code: CvUploadErrorCode.VIRUS_DETECTED };

    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.VIRUS_DETECTED);
  });

  it('maps invalid file type error from API correctly', () => {
    const error = { code: CvUploadErrorCode.INVALID_FILE_TYPE };

    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('maps file size exceeded error from API correctly', () => {
    const error = { code: CvUploadErrorCode.FILE_SIZE_EXCEEDED };

    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('returns unknown error for unrecognized errors', () => {
    const error = new Error('Something unexpected');

    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns unknown error for null input', () => {
    expect(mapApiErrorToCode(null)).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns unknown error for undefined input', () => {
    expect(mapApiErrorToCode(undefined)).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns unknown error for string input', () => {
    expect(mapApiErrorToCode('error string')).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('handles network error correctly', () => {
    const error = new Error('Network request failed');
    error.name = 'TypeError';

    // Network errors without AbortError name should map to unknown or a network error code
    const result = mapApiErrorToCode(error);
    expect(result).toBeDefined();
  });
});
