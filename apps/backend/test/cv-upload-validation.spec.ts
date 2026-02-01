/**
 * Unit tests for CvFileValidationPipe
 *
 * Tests the validation logic for CV file uploads including:
 * - File type validation (PDF, DOC, DOCX)
 * - File size limits
 * - File corruption detection
 * - Edge cases (missing file, empty file)
 */

import { CvFileValidationPipe } from '../src/common/pipes/cv-file-validation.pipe';
import {
  InvalidFileTypeException,
  FileSizeExceededException,
  FileCorruptedException,
} from '../src/common/exceptions/cv-upload.exception';

describe('CvFileValidationPipe', () => {
  let pipe: CvFileValidationPipe;

  beforeEach(() => {
    pipe = new CvFileValidationPipe();
  });

  describe('valid file uploads', () => {
    it('should pass valid PDF file', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 1024 * 1024, // 1MB
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should pass valid DOC file', () => {
      const file = {
        originalname: 'resume.doc',
        mimetype: 'application/msword',
        size: 1024 * 1024, // 1MB
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should pass valid DOCX file', () => {
      const file = {
        originalname: 'resume.docx',
        mimetype:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 1024 * 1024, // 1MB
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should pass file at maximum allowed size', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 10 * 1024 * 1024, // 10MB (assuming this is the limit)
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });
  });

  describe('invalid file type', () => {
    it('should throw InvalidFileTypeException for unsupported type', () => {
      const file = {
        originalname: 'image.png',
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException for executable files', () => {
      const file = {
        originalname: 'malware.exe',
        mimetype: 'application/x-msdownload',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException for text files', () => {
      const file = {
        originalname: 'resume.txt',
        mimetype: 'text/plain',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        InvalidFileTypeException,
      );
    });
  });

  describe('file size validation', () => {
    it('should throw FileSizeExceededException for large files', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 15 * 1024 * 1024, // 15MB
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        FileSizeExceededException,
      );
    });

    it('should throw FileSizeExceededException for extremely large files', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 100 * 1024 * 1024, // 100MB
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        FileSizeExceededException,
      );
    });
  });

  describe('file corruption detection', () => {
    it('should throw FileCorruptedException for empty files', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 0,
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        FileCorruptedException,
      );
    });

    it('should throw FileCorruptedException for file with zero size but non-empty buffer', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 0,
        buffer: Buffer.from('some content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        FileCorruptedException,
      );
    });
  });

  describe('missing file handling', () => {
    it('should throw InvalidFileTypeException when no file provided', () => {
      expect(() => pipe.transform(undefined as any, { type: 'body' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException when null file provided', () => {
      expect(() => pipe.transform(null as any, { type: 'body' })).toThrow(
        InvalidFileTypeException,
      );
    });
  });

  describe('edge cases', () => {
    it('should handle file with special characters in name', () => {
      const file = {
        originalname: 'my resume (2024) - final.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should handle file with unicode characters in name', () => {
      const file = {
        originalname: '履歴書_レジュメ.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should handle minimum valid file size', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 1, // 1 byte
        buffer: Buffer.from('x'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });
  });
});
