/**
 * Unit tests for file validation utilities
 * Tests CV file validation including format and size checks
 */

import { validateCVFile, getAcceptAttribute } from '../fileValidation';
import { CV_ACCEPTED_FORMATS, CV_VALIDATION_MESSAGES } from '@repo/dto';

describe('validateCVFile', () => {
  /**
   * Helper function to create a mock File object for testing
   * @param name - The file name
   * @param type - The MIME type of the file
   * @param size - The file size in bytes
   * @returns A mock File object
   */
  const createMockFile = (name: string, type: string, size: number): File => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  describe('valid file formats', () => {
    it('accepts valid PDF file', () => {
      const file = createMockFile('resume.pdf', 'application/pdf', 1024);
      const result = validateCVFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts valid DOC file', () => {
      const file = createMockFile('resume.doc', 'application/msword', 1024);
      const result = validateCVFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts valid DOCX file', () => {
      const file = createMockFile(
        'resume.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        1024
      );
      const result = validateCVFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('invalid file formats', () => {
    it('rejects JPEG image file', () => {
      const file = createMockFile('image.jpg', 'image/jpeg', 1024);
      const result = validateCVFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CV_VALIDATION_MESSAGES.invalidFormat);
    });

    it('rejects PNG image file', () => {
      const file = createMockFile('image.png', 'image/png', 1024);
      const result = validateCVFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CV_VALIDATION_MESSAGES.invalidFormat);
    });

    it('rejects text file', () => {
      const file = createMockFile('document.txt', 'text/plain', 1024);
      const result = validateCVFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CV_VALIDATION_MESSAGES.invalidFormat);
    });

    it('rejects executable file', () => {
      const file = createMockFile('program.exe', 'application/x-msdownload', 1024);
      const result = validateCVFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CV_VALIDATION_MESSAGES.invalidFormat);
    });
  });

  describe('file size validation', () => {
    it('rejects file exceeding max size', () => {
      const file = createMockFile(
        'resume.pdf',
        'application/pdf',
        CV_ACCEPTED_FORMATS.maxSizeBytes + 1
      );
      const result = validateCVFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CV_VALIDATION_MESSAGES.fileTooLarge);
    });

    it('accepts file at exactly max size', () => {
      const file = createMockFile(
        'resume.pdf',
        'application/pdf',
        CV_ACCEPTED_FORMATS.maxSizeBytes
      );
      const result = validateCVFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts file below max size', () => {
      const file = createMockFile(
        'resume.pdf',
        'application/pdf',
        CV_ACCEPTED_FORMATS.maxSizeBytes - 1
      );
      const result = validateCVFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts empty file (0 bytes)', () => {
      const file = createMockFile('resume.pdf', 'application/pdf', 0);
      const result = validateCVFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});

describe('getAcceptAttribute', () => {
  it('returns comma-separated list of extensions and mime types', () => {
    const result = getAcceptAttribute();
    expect(result).toContain('.pdf');
    expect(result).toContain('.doc');
    expect(result).toContain('.docx');
    expect(result).toContain('application/pdf');
  });

  it('returns a non-empty string', () => {
    const result = getAcceptAttribute();
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('contains MIME type for Word documents', () => {
    const result = getAcceptAttribute();
    expect(result).toContain('application/msword');
  });
});
