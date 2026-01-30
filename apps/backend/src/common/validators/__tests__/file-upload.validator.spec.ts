/**
 * Unit tests for file-upload.validator
 * Tests CV file validation logic including mime type and size validation
 */
import { BadRequestException } from '@nestjs/common';
import { validateCVFile, cvFileFilter } from '../file-upload.validator';
import { CV_VALIDATION_MESSAGES } from '@repo/dto';

describe('file-upload.validator', () => {
  describe('validateCVFile', () => {
    it('should pass for valid PDF file', () => {
      const file = {
        mimetype: 'application/pdf',
        size: 1024,
      } as Express.Multer.File;

      expect(() => validateCVFile(file)).not.toThrow();
    });

    it('should throw for invalid mime type', () => {
      const file = {
        mimetype: 'text/plain',
        size: 1024,
      } as Express.Multer.File;

      expect(() => validateCVFile(file)).toThrow(BadRequestException);
      expect(() => validateCVFile(file)).toThrow(CV_VALIDATION_MESSAGES.invalidFormat);
    });

    it('should throw for file exceeding size limit', () => {
      const file = {
        mimetype: 'application/pdf',
        size: 10 * 1024 * 1024, // 10MB
      } as Express.Multer.File;

      expect(() => validateCVFile(file)).toThrow(BadRequestException);
      expect(() => validateCVFile(file)).toThrow(CV_VALIDATION_MESSAGES.fileTooLarge);
    });
  });

  describe('cvFileFilter', () => {
    it('should accept valid PDF file', () => {
      const file = { mimetype: 'application/pdf' } as Express.Multer.File;
      const callback = jest.fn();

      cvFileFilter({}, file, callback);

      expect(callback).toHaveBeenCalledWith(null, true);
    });

    it('should reject invalid file type', () => {
      const file = { mimetype: 'text/plain' } as Express.Multer.File;
      const callback = jest.fn();

      cvFileFilter({}, file, callback);

      expect(callback).toHaveBeenCalledWith(expect.any(BadRequestException), false);
    });
  });
});
