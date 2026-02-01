/**
 * Integration tests for CV upload validation
 * Tests the CvFileValidationPipe for various file validation scenarios
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CvFileValidationPipe } from '../src/common/pipes/cv-file-validation.pipe';
import { CvUploadException } from '../src/common/exceptions/cv-upload.exception';
import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@repo/dto';

describe('CvFileValidationPipe', () => {
  let pipe: CvFileValidationPipe;

  beforeEach(async () => {
    pipe = new CvFileValidationPipe();
  });

  describe('Valid file scenarios', () => {
    it('should pass valid PDF file', () => {
      const file = {
        mimetype: 'application/pdf',
        size: 1024 * 1024,
        buffer: Buffer.from('PDF content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });

    it('should pass valid DOCX file', () => {
      const file = {
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 1024 * 512,
        buffer: Buffer.from('DOCX content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });

    it('should pass file at exactly max size limit', () => {
      const file = {
        mimetype: 'application/pdf',
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE,
        buffer: Buffer.from('PDF content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });

    it('should pass file with minimum valid size', () => {
      const file = {
        mimetype: 'application/pdf',
        size: 1,
        buffer: Buffer.from('x'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });
  });

  describe('Invalid file type scenarios', () => {
    it('should throw for invalid file type (image/png)', () => {
      const file = {
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      try {
        pipe.transform(file, { type: 'custom' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CvUploadException);
        const response = (error as CvUploadException).getResponse() as any;
        expect(response.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
      }
    });

    it('should throw for invalid file type (text/plain)', () => {
      const file = {
        mimetype: 'text/plain',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      try {
        pipe.transform(file, { type: 'custom' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CvUploadException);
        const response = (error as CvUploadException).getResponse() as any;
        expect(response.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
      }
    });

    it('should throw for invalid file type (application/zip)', () => {
      const file = {
        mimetype: 'application/zip',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      try {
        pipe.transform(file, { type: 'custom' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CvUploadException);
        const response = (error as CvUploadException).getResponse() as any;
        expect(response.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
      }
    });
  });

  describe('File size validation scenarios', () => {
    it('should throw for file exceeding size limit', () => {
      const file = {
        mimetype: 'application/pdf',
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE + 1,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      try {
        pipe.transform(file, { type: 'custom' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CvUploadException);
        const response = (error as CvUploadException).getResponse() as any;
        expect(response.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
      }
    });

    it('should throw for file significantly exceeding size limit', () => {
      const file = {
        mimetype: 'application/pdf',
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE * 2,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      try {
        pipe.transform(file, { type: 'custom' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CvUploadException);
        const response = (error as CvUploadException).getResponse() as any;
        expect(response.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
      }
    });
  });

  describe('Corrupted file scenarios', () => {
    it('should throw for empty buffer (corrupted file)', () => {
      const file = {
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      try {
        pipe.transform(file, { type: 'custom' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CvUploadException);
        const response = (error as CvUploadException).getResponse() as any;
        expect(response.code).toBe(CvUploadErrorCode.FILE_CORRUPTED);
      }
    });

    it('should throw for undefined buffer', () => {
      const file = {
        mimetype: 'application/pdf',
        size: 1024,
        buffer: undefined,
      } as unknown as Express.Multer.File;

      try {
        pipe.transform(file, { type: 'custom' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CvUploadException);
        const response = (error as CvUploadException).getResponse() as any;
        expect(response.code).toBe(CvUploadErrorCode.FILE_CORRUPTED);
      }
    });

    it('should throw for null buffer', () => {
      const file = {
        mimetype: 'application/pdf',
        size: 1024,
        buffer: null,
      } as unknown as Express.Multer.File;

      try {
        pipe.transform(file, { type: 'custom' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CvUploadException);
        const response = (error as CvUploadException).getResponse() as any;
        expect(response.code).toBe(CvUploadErrorCode.FILE_CORRUPTED);
      }
    });
  });

  describe('Missing file scenarios', () => {
    it('should throw for undefined file', () => {
      try {
        pipe.transform(undefined as unknown as Express.Multer.File, { type: 'custom' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CvUploadException);
      }
    });

    it('should throw for null file', () => {
      try {
        pipe.transform(null as unknown as Express.Multer.File, { type: 'custom' });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CvUploadException);
      }
    });
  });
});
