/**
 * Unit tests for CV upload validator utility
 * Tests file validation and API error mapping functionality
 */
import { describe, it, expect } from 'vitest';
import { validateCvFile, mapApiErrorToCode } from '../cv-upload-validator';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

describe('validateCvFile', () => {
  it('returns null for valid PDF file', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    expect(validateCvFile(file)).toBeNull();
  });

  it('returns null for valid DOCX file', () => {
    const file = new File(['content'], 'resume.docx', { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 });
    expect(validateCvFile(file)).toBeNull();
  });

  it('returns null for valid DOC file', () => {
    const file = new File(['content'], 'resume.doc', { type: 'application/msword' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 });
    expect(validateCvFile(file)).toBeNull();
  });

  it('returns INVALID_FILE_TYPE for unsupported file type', () => {
    const file = new File(['content'], 'resume.txt', { type: 'text/plain' });
    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns INVALID_FILE_TYPE for image files', () => {
    const file = new File(['content'], 'image.png', { type: 'image/png' });
    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns INVALID_FILE_TYPE for JPEG image files', () => {
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });
    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns INVALID_FILE_TYPE for executable files', () => {
    const file = new File(['content'], 'malware.exe', { type: 'application/x-msdownload' });
    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns FILE_SIZE_EXCEEDED for files over 10MB', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }); // 11MB
    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('returns FILE_SIZE_EXCEEDED for large files (15MB)', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 }); // 15MB
    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('returns null for file at exact size limit (10MB)', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // 10MB
    expect(validateCvFile(file)).toBeNull();
  });

  it('returns CORRUPTED_FILE for empty files', () => {
    const file = new File([], 'resume.pdf', { type: 'application/pdf' });
    const result = validateCvFile(file);
    expect(result?.code).toBe(CvUploadErrorCode.CORRUPTED_FILE);
  });

  it('returns null for small valid file', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 }); // 1KB
    expect(validateCvFile(file)).toBeNull();
  });
});

describe('mapApiErrorToCode', () => {
  it('returns NETWORK_TIMEOUT for AbortError', () => {
    const error = new Error('AbortError');
    error.name = 'AbortError';
    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.NETWORK_TIMEOUT);
  });

  it('returns NETWORK_TIMEOUT for TypeError with fetch failure message', () => {
    const error = new TypeError('Failed to fetch');
    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.NETWORK_TIMEOUT);
  });

  it('returns correct code from API response for FILE_CORRUPTED', () => {
    const error = { code: CvUploadErrorCode.FILE_CORRUPTED };
    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.FILE_CORRUPTED);
  });

  it('returns correct code for INVALID_FILE_TYPE from API', () => {
    const error = { code: CvUploadErrorCode.INVALID_FILE_TYPE };
    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns correct code for FILE_SIZE_EXCEEDED from API', () => {
    const error = { code: CvUploadErrorCode.FILE_SIZE_EXCEEDED };
    expect(mapApiErrorToCode(error)).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('returns UNKNOWN_ERROR for unrecognized errors', () => {
    expect(mapApiErrorToCode(new Error('random error'))).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns UNKNOWN_ERROR for null input', () => {
    expect(mapApiErrorToCode(null)).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns UNKNOWN_ERROR for undefined input', () => {
    expect(mapApiErrorToCode(undefined)).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns UNKNOWN_ERROR for empty object', () => {
    expect(mapApiErrorToCode({})).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns UNKNOWN_ERROR for string input', () => {
    expect(mapApiErrorToCode('some error string')).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });
});
