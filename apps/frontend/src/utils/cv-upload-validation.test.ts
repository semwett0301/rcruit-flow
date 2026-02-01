/**
 * Unit tests for CV upload validation utilities
 * Tests file validation and HTTP error mapping functionality
 */
import { describe, it, expect } from 'vitest';
import { validateCvFile, mapHttpErrorToCvUploadError } from './cv-upload-validation';
import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

describe('validateCvFile', () => {
  it('returns null for valid PDF file', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 });

    expect(validateCvFile(file)).toBeNull();
  });

  it('returns INVALID_FILE_TYPE for unsupported file type', () => {
    const file = new File(['content'], 'resume.txt', { type: 'text/plain' });

    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns FILE_SIZE_EXCEEDED for large files', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1 });

    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });
});

describe('mapHttpErrorToCvUploadError', () => {
  it('maps 413 status to FILE_SIZE_EXCEEDED', () => {
    const error = { response: { status: 413 } };
    expect(mapHttpErrorToCvUploadError(error)).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('maps 415 status to INVALID_FILE_TYPE', () => {
    const error = { response: { status: 415 } };
    expect(mapHttpErrorToCvUploadError(error)).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('maps 5xx status to SERVER_ERROR', () => {
    const error = { response: { status: 500 } };
    expect(mapHttpErrorToCvUploadError(error)).toBe(CvUploadErrorCode.SERVER_ERROR);
  });

  it('maps timeout errors to UPLOAD_TIMEOUT', () => {
    const error = new Error('Request timeout');
    error.name = 'AbortError';
    expect(mapHttpErrorToCvUploadError(error)).toBe(CvUploadErrorCode.UPLOAD_TIMEOUT);
  });

  it('returns UNKNOWN_ERROR for unrecognized errors', () => {
    const error = { something: 'unexpected' };
    expect(mapHttpErrorToCvUploadError(error)).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });
});
