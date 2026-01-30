/**
 * Unit tests for file validation utility functions
 * Tests CV file validation including format and size checks
 */
import { validateCVFile, getAcceptAttribute } from '../file-validation';
import { CV_ACCEPTED_FORMATS, CV_VALIDATION_MESSAGES } from '@repo/dto';

describe('file-validation', () => {
  describe('validateCVFile', () => {
    it('should return valid for PDF files', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const result = validateCVFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for DOC files', () => {
      const file = new File(['content'], 'test.doc', { type: 'application/msword' });
      const result = validateCVFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for DOCX files', () => {
      const file = new File(['content'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const result = validateCVFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for unsupported file types', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = validateCVFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CV_VALIDATION_MESSAGES.invalidFormat);
    });

    it('should return invalid for image files', () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const result = validateCVFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CV_VALIDATION_MESSAGES.invalidFormat);
    });

    it('should return invalid for files exceeding size limit', () => {
      // Create a file larger than 5MB (the typical CV size limit)
      const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
      const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' });
      const result = validateCVFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CV_VALIDATION_MESSAGES.fileTooLarge);
    });

    it('should return valid for files within size limit', () => {
      // Create a file smaller than 5MB
      const smallContent = new Array(1024).fill('a').join('');
      const file = new File([smallContent], 'small.pdf', { type: 'application/pdf' });
      const result = validateCVFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty file type with unsupported extension', () => {
      const file = new File(['content'], 'test.xyz', { type: '' });
      const result = validateCVFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CV_VALIDATION_MESSAGES.invalidFormat);
    });
  });

  describe('getAcceptAttribute', () => {
    it('should return comma-separated mime types and extensions', () => {
      const result = getAcceptAttribute();
      expect(result).toContain('application/pdf');
      expect(result).toContain('.pdf');
    });

    it('should include Word document formats', () => {
      const result = getAcceptAttribute();
      expect(result).toContain('application/msword');
      expect(result).toContain('.doc');
      expect(result).toContain('.docx');
    });

    it('should return a non-empty string', () => {
      const result = getAcceptAttribute();
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
