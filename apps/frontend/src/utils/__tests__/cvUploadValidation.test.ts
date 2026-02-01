/**
 * Unit tests for CV upload validation utilities
 *
 * Tests the validateCvFile function for file type, size, and corruption validation
 * Tests the mapHttpErrorToCode function for HTTP status code mapping
 */
import { validateCvFile, mapHttpErrorToCode } from '../cvUploadValidation';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

describe('validateCvFile', () => {
  it('returns valid for PDF file within size limit', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    expect(validateCvFile(file)).toEqual({ isValid: true });
  });

  it('returns INVALID_FILE_TYPE for unsupported file type', () => {
    const file = new File(['content'], 'image.png', { type: 'image/png' });
    expect(validateCvFile(file)).toEqual({
      isValid: false,
      errorCode: CvUploadErrorCode.INVALID_FILE_TYPE
    });
  });

  it('returns FILE_SIZE_EXCEEDED for large files', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 }); // 15MB
    expect(validateCvFile(file)).toEqual({
      isValid: false,
      errorCode: CvUploadErrorCode.FILE_SIZE_EXCEEDED
    });
  });

  it('returns FILE_CORRUPTED for empty files', () => {
    const file = new File([], 'resume.pdf', { type: 'application/pdf' });
    expect(validateCvFile(file)).toEqual({
      isValid: false,
      errorCode: CvUploadErrorCode.FILE_CORRUPTED
    });
  });
});

describe('mapHttpErrorToCode', () => {
  it('maps 400 to INVALID_FILE_TYPE', () => {
    expect(mapHttpErrorToCode(400)).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
  });

  it('maps 413 to FILE_SIZE_EXCEEDED', () => {
    expect(mapHttpErrorToCode(413)).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
  });

  it('maps 422 to FILE_CORRUPTED', () => {
    expect(mapHttpErrorToCode(422)).toBe(CvUploadErrorCode.FILE_CORRUPTED);
  });

  it('maps 500 to SERVER_ERROR', () => {
    expect(mapHttpErrorToCode(500)).toBe(CvUploadErrorCode.SERVER_ERROR);
  });

  it('uses provided error code when valid', () => {
    expect(mapHttpErrorToCode(400, CvUploadErrorCode.FILE_CORRUPTED)).toBe(CvUploadErrorCode.FILE_CORRUPTED);
  });
});
