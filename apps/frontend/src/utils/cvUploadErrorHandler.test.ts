/**
 * Unit tests for CV upload error handler utility
 * Tests the parseCvUploadError function for various error scenarios
 */
import { parseCvUploadError } from './cvUploadErrorHandler';
import { CvUploadErrorCode } from '@repo/dto';
import { cvUploadErrorMessages } from '../constants/cvUploadErrors';

describe('parseCvUploadError', () => {
  it('parses backend error response correctly', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          code: CvUploadErrorCode.INVALID_FILE_TYPE,
          message: 'Invalid file type'
        }
      }
    };

    const result = parseCvUploadError(axiosError);
    expect(result).toEqual(cvUploadErrorMessages[CvUploadErrorCode.INVALID_FILE_TYPE]);
  });

  it('handles network timeout', () => {
    const axiosError = {
      isAxiosError: true,
      code: 'ECONNABORTED',
      response: undefined
    };

    const result = parseCvUploadError(axiosError);
    expect(result).toEqual(cvUploadErrorMessages[CvUploadErrorCode.NETWORK_TIMEOUT]);
  });

  it('handles network errors without response', () => {
    const axiosError = {
      isAxiosError: true,
      response: undefined
    };

    const result = parseCvUploadError(axiosError);
    expect(result).toEqual(cvUploadErrorMessages[CvUploadErrorCode.NETWORK_TIMEOUT]);
  });

  it('returns unknown error for unrecognized errors', () => {
    const unknownError = new Error('Something went wrong');

    const result = parseCvUploadError(unknownError);
    expect(result).toEqual(cvUploadErrorMessages[CvUploadErrorCode.UNKNOWN_ERROR]);
  });

  it('handles file size exceeded error', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
          message: 'File too large',
          details: { maxSize: 10 }
        }
      }
    };

    const result = parseCvUploadError(axiosError);
    expect(result).toEqual(cvUploadErrorMessages[CvUploadErrorCode.FILE_SIZE_EXCEEDED]);
  });
});
