/**
 * Unit tests for CV upload error message mapping utility
 * Tests the mapCvUploadErrorToUserMessage function for all error codes
 */
import { CvUploadErrorCode, CvUploadErrorResponse } from '@repo/dto';
import { mapCvUploadErrorToUserMessage, UserFriendlyError } from '../cv-upload-error-messages';

describe('mapCvUploadErrorToUserMessage', () => {
  it('should return correct message for INVALID_FILE_TYPE', () => {
    const error: CvUploadErrorResponse = {
      code: CvUploadErrorCode.INVALID_FILE_TYPE,
      message: 'Invalid file type'
    };

    const result = mapCvUploadErrorToUserMessage(error);

    expect(result.title).toBe('Unsupported File Format');
    expect(result.suggestion).toContain('PDF');
    expect(result.showContactSupport).toBe(false);
  });

  it('should return correct message for FILE_SIZE_EXCEEDED', () => {
    const error: CvUploadErrorResponse = {
      code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
      message: 'File too large'
    };

    const result = mapCvUploadErrorToUserMessage(error);

    expect(result.title).toBe('File Too Large');
    expect(result.suggestion).toContain('reduce');
    expect(result.showContactSupport).toBe(false);
  });

  it('should return correct message for SERVER_ERROR with contact support', () => {
    const error: CvUploadErrorResponse = {
      code: CvUploadErrorCode.SERVER_ERROR,
      message: 'Server error'
    };

    const result = mapCvUploadErrorToUserMessage(error);

    expect(result.title).toBe('Upload Failed');
    expect(result.showContactSupport).toBe(true);
  });

  it('should return correct message for FILE_CORRUPTED', () => {
    const error: CvUploadErrorResponse = {
      code: CvUploadErrorCode.FILE_CORRUPTED,
      message: 'File corrupted'
    };

    const result = mapCvUploadErrorToUserMessage(error);

    expect(result.title).toBe('File Cannot Be Read');
    expect(result.suggestion).toContain('check');
  });

  it('should return correct message for NETWORK_TIMEOUT', () => {
    const error: CvUploadErrorResponse = {
      code: CvUploadErrorCode.NETWORK_TIMEOUT,
      message: 'Timeout'
    };

    const result = mapCvUploadErrorToUserMessage(error);

    expect(result.title).toBe('Connection Timed Out');
    expect(result.suggestion).toContain('internet connection');
  });

  it('should return fallback message for unknown error codes', () => {
    const error: CvUploadErrorResponse = {
      code: 'UNKNOWN_CODE' as CvUploadErrorCode,
      message: 'Unknown'
    };

    const result = mapCvUploadErrorToUserMessage(error);

    expect(result.title).toBe('Something Went Wrong');
    expect(result.showContactSupport).toBe(true);
  });
});
