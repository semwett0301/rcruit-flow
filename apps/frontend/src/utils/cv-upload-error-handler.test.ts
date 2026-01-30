/**
 * Unit tests for CV upload error handler utility
 * Tests file validation and API error mapping functionality
 */
import { validateFileBeforeUpload, mapApiErrorToUploadError } from './cv-upload-error-handler';
import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

describe('validateFileBeforeUpload', () => {
  it('returns null for valid PDF file', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    expect(validateFileBeforeUpload(file)).toBeNull();
  });

  it('returns null for valid DOCX file', () => {
    const file = new File(['content'], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    expect(validateFileBeforeUpload(file)).toBeNull();
  });

  it('returns null for valid DOC file', () => {
    const file = new File(['content'], 'resume.doc', { type: 'application/msword' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    expect(validateFileBeforeUpload(file)).toBeNull();
  });

  it('returns INVALID_FILE_TYPE for unsupported file type', () => {
    const file = new File(['content'], 'image.png', { type: 'image/png' });
    const result = validateFileBeforeUpload(file);
    expect(result?.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns INVALID_FILE_TYPE for executable files', () => {
    const file = new File(['content'], 'malware.exe', { type: 'application/x-msdownload' });
    const result = validateFileBeforeUpload(file);
    expect(result?.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('returns FILE_SIZE_EXCEEDED for large files', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1 });
    const result = validateFileBeforeUpload(file);
    expect(result?.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('returns FILE_SIZE_EXCEEDED for file exactly at limit + 1 byte', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1 });
    const result = validateFileBeforeUpload(file);
    expect(result?.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('returns null for file exactly at size limit', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES });
    expect(validateFileBeforeUpload(file)).toBeNull();
  });

  it('returns null for empty file (0 bytes)', () => {
    const file = new File([], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 0 });
    expect(validateFileBeforeUpload(file)).toBeNull();
  });
});

describe('mapApiErrorToUploadError', () => {
  it('returns structured error from API response', () => {
    const error = {
      response: {
        data: { code: CvUploadErrorCode.FILE_CORRUPTED, message: 'File corrupted' },
        status: 422
      }
    };
    const result = mapApiErrorToUploadError(error);
    expect(result.code).toBe(CvUploadErrorCode.FILE_CORRUPTED);
    expect(result.message).toBe('File corrupted');
  });

  it('returns NETWORK_TIMEOUT for timeout errors', () => {
    const error = { code: 'ECONNABORTED', message: 'timeout' };
    const result = mapApiErrorToUploadError(error);
    expect(result.code).toBe(CvUploadErrorCode.NETWORK_TIMEOUT);
  });

  it('returns NETWORK_TIMEOUT for timeout of 0ms errors', () => {
    const error = { code: 'ECONNABORTED', message: 'timeout of 0ms exceeded' };
    const result = mapApiErrorToUploadError(error);
    expect(result.code).toBe(CvUploadErrorCode.NETWORK_TIMEOUT);
  });

  it('returns SERVER_ERROR for 500 response', () => {
    const error = { response: { status: 500 } };
    const result = mapApiErrorToUploadError(error);
    expect(result.code).toBe(CvUploadErrorCode.SERVER_ERROR);
  });

  it('returns SERVER_ERROR for 502 response', () => {
    const error = { response: { status: 502 } };
    const result = mapApiErrorToUploadError(error);
    expect(result.code).toBe(CvUploadErrorCode.SERVER_ERROR);
  });

  it('returns SERVER_ERROR for 503 response', () => {
    const error = { response: { status: 503 } };
    const result = mapApiErrorToUploadError(error);
    expect(result.code).toBe(CvUploadErrorCode.SERVER_ERROR);
  });

  it('returns SERVER_ERROR for 504 response', () => {
    const error = { response: { status: 504 } };
    const result = mapApiErrorToUploadError(error);
    expect(result.code).toBe(CvUploadErrorCode.SERVER_ERROR);
  });

  it('returns UNKNOWN_ERROR for unrecognized errors', () => {
    const result = mapApiErrorToUploadError(new Error('Random error'));
    expect(result.code).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns UNKNOWN_ERROR for null error', () => {
    const result = mapApiErrorToUploadError(null);
    expect(result.code).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns UNKNOWN_ERROR for undefined error', () => {
    const result = mapApiErrorToUploadError(undefined);
    expect(result.code).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('returns UNKNOWN_ERROR for 4xx responses without structured data', () => {
    const error = { response: { status: 400 } };
    const result = mapApiErrorToUploadError(error);
    expect(result.code).toBe(CvUploadErrorCode.UNKNOWN_ERROR);
  });

  it('preserves error code from API response for known error codes', () => {
    const error = {
      response: {
        data: { code: CvUploadErrorCode.INVALID_FILE_TYPE, message: 'Invalid type' },
        status: 422
      }
    };
    const result = mapApiErrorToUploadError(error);
    expect(result.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('preserves error code for FILE_SIZE_EXCEEDED from API', () => {
    const error = {
      response: {
        data: { code: CvUploadErrorCode.FILE_SIZE_EXCEEDED, message: 'File too large' },
        status: 413
      }
    };
    const result = mapApiErrorToUploadError(error);
    expect(result.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });
});
