/**
 * Unit tests for CV upload error message mapping utility.
 * Tests that each error code returns the appropriate user-friendly message.
 */
import { describe, it, expect } from 'vitest';
import { getCvUploadErrorMessage } from '../cv-upload-error-messages';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

describe('getCvUploadErrorMessage', () => {
  it('should return appropriate message for INVALID_FILE_TYPE', () => {
    const error = getCvUploadErrorMessage(CvUploadErrorCode.INVALID_FILE_TYPE);
    expect(error.title).toBe('Unsupported File Format');
    expect(error.message).toContain('.pdf');
    expect(error.action).toBeTruthy();
  });

  it('should return appropriate message for FILE_SIZE_EXCEEDED', () => {
    const error = getCvUploadErrorMessage(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
    expect(error.title).toBe('File Too Large');
    expect(error.message).toContain('10MB');
    expect(error.action).toContain('reduce');
  });

  it('should return appropriate message for FILE_CORRUPTED', () => {
    const error = getCvUploadErrorMessage(CvUploadErrorCode.FILE_CORRUPTED);
    expect(error.title).toBe('Unable to Read File');
    expect(error.action).toContain('check');
  });

  it('should return appropriate message for SERVER_ERROR', () => {
    const error = getCvUploadErrorMessage(CvUploadErrorCode.SERVER_ERROR);
    expect(error.title).toBe('Upload Failed');
    expect(error.action).toContain('try again');
  });

  it('should return appropriate message for NETWORK_TIMEOUT', () => {
    const error = getCvUploadErrorMessage(CvUploadErrorCode.NETWORK_TIMEOUT);
    expect(error.title).toBe('Connection Timeout');
    expect(error.action).toContain('internet connection');
  });

  it('should return fallback message for UNKNOWN_ERROR', () => {
    const error = getCvUploadErrorMessage(CvUploadErrorCode.UNKNOWN_ERROR);
    expect(error.title).toBe('Something Went Wrong');
    expect(error.action).toContain('support');
  });
});
