/**
 * Unit tests for file upload validation utilities
 * Tests validateCVFile and cvFileFilter functions for CV/resume uploads
 */
import { BadRequestException } from '@nestjs/common';
import { validateCVFile, cvFileFilter } from '../file-upload.validator';
import { CV_VALIDATION_MESSAGES, CV_ACCEPTED_FORMATS } from '@repo/dto';

describe('validateCVFile', () => {
  /**
   * Helper function to create a mock Express.Multer.File object
   */
  const createMockFile = (originalname: string, mimetype: string, size: number): Express.Multer.File => ({
    originalname,
    mimetype,
    size,
    fieldname: 'cv',
    encoding: '7bit',
    buffer: Buffer.from(''),
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
  });

  it('accepts valid PDF file', () => {
    const file = createMockFile('resume.pdf', 'application/pdf', 1024);
    expect(() => validateCVFile(file)).not.toThrow();
  });

  it('throws BadRequestException for invalid mime type', () => {
    const file = createMockFile('image.jpg', 'image/jpeg', 1024);
    expect(() => validateCVFile(file)).toThrow(BadRequestException);
    expect(() => validateCVFile(file)).toThrow(CV_VALIDATION_MESSAGES.invalidFormat);
  });

  it('throws BadRequestException for file exceeding max size', () => {
    const file = createMockFile('resume.pdf', 'application/pdf', CV_ACCEPTED_FORMATS.maxSizeBytes + 1);
    expect(() => validateCVFile(file)).toThrow(BadRequestException);
    expect(() => validateCVFile(file)).toThrow(CV_VALIDATION_MESSAGES.fileTooLarge);
  });
});

describe('cvFileFilter', () => {
  it('accepts valid file', (done) => {
    const file = { originalname: 'resume.pdf', mimetype: 'application/pdf' } as Express.Multer.File;
    cvFileFilter({}, file, (error, accept) => {
      expect(error).toBeNull();
      expect(accept).toBe(true);
      done();
    });
  });

  it('rejects invalid file', (done) => {
    const file = { originalname: 'image.jpg', mimetype: 'image/jpeg' } as Express.Multer.File;
    cvFileFilter({}, file, (error, accept) => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(accept).toBe(false);
      done();
    });
  });
});
