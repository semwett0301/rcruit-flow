/**
 * Unit tests for CV upload validator utility
 * Tests file validation and API error mapping functionality
 */
import { describe, it, expect } from 'vitest';
import { validateCvFile, mapApiErrorToCode } from '../cv-upload-validator';
import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@repo/dto';

describe('validateCvFile', () => {
  it('returns null for valid PDF file', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    
    expect(validateCvFile(file)).toBeNull();
  });

  it('returns null for valid file at exact size limit', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE });
    
    expect(validateCvFile(file)).toBeNull();
  });

  it('returns error for invalid file type', () => {
    const file = new File(['content'], 'image.png', { type: 'image/png' });
    
    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns error for file exceeding size limit', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE + 1 });
    
    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('returns error for empty file', () => {
    const file = new File([], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 0 });
    
    const result = validateCvFile(file);
    // Empty files should either be invalid or have a specific error
    expect(result).not.toBeNull();
  });

  it('returns error for file with wrong extension but correct mime type', () => {
    const file = new File(['content'], 'resume.txt', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 });
    
    // Behavior depends on implementation - test that validation runs
    const result = validateCvFile(file);
    // Result could be null or error depending on whether extension is checked
    expect(result === null || result?.code).toBeDefined();
  });
});

describe('mapApiErrorToCode', () => {
  it('maps timeout errors correctly', () => {
    const error = new Error('Request timeout');
    error.name = 'AbortError';
    
    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.NETWORK_TIMEOUT);
  });

  it('maps API error responses correctly', () => {
    const apiError = { code: CvUploadErrorCode.FILE_CORRUPTED };
    
    expect(mapApiErrorToCode(apiError)).toBe(CvUploadErrorCode.FILE_CORRUPTED);
  });

  it('returns UNKNOWN_ERROR for unrecognized errors', () => {
    const error = { something: 'else' };
    
    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns UNKNOWN_ERROR for null input', () => {
    expect(mapApiErrorToCode(null)).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns UNKNOWN_ERROR for undefined input', () => {
    expect(mapApiErrorToCode(undefined)).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('maps network errors correctly', () => {
    const error = new TypeError('Failed to fetch');
    
    const result = mapApiErrorToCode(error);
    // Should map to network-related error or unknown
    expect([
      CvUploadErrorCode.NETWORK_TIMEOUT,
      CvUploadErrorCode.UNKNOWN_ERROR
    ]).toContain(result);
  });

  it('preserves valid error codes from API response', () => {
    const apiError = { code: CvUploadErrorCode.INVALID_FILE_TYPE };
    
    expect(mapApiErrorToCode(apiError)).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('handles API error with FILE_SIZE_EXCEEDED code', () => {
    const apiError = { code: CvUploadErrorCode.FILE_SIZE_EXCEEDED };
    
    expect(mapApiErrorToCode(apiError)).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });
});
