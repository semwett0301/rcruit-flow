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
  CorruptedFileException,
} from '../src/common/exceptions/cv-upload.exception';
import { CV_UPLOAD_CONSTRAINTS } from '@recruit-flow/dto';

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
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES, // Exactly at limit
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

    it('should throw InvalidFileTypeException for HTML files', () => {
      const file = {
        originalname: 'resume.html',
        mimetype: 'text/html',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException for ZIP files', () => {
      const file = {
        originalname: 'resume.zip',
        mimetype: 'application/zip',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        InvalidFileTypeException,
      );
    });
  });

  describe('file size validation', () => {
    it('should throw FileSizeExceededException for files exceeding max size', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1,
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

    it('should throw FileSizeExceededException for DOC files exceeding limit', () => {
      const file = {
        originalname: 'resume.doc',
        mimetype: 'application/msword',
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        FileSizeExceededException,
      );
    });
  });

  describe('file corruption detection', () => {
    it('should throw CorruptedFileException for empty files', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 0,
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        CorruptedFileException,
      );
    });

    it('should throw CorruptedFileException for file with zero size but non-empty buffer', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 0,
        buffer: Buffer.from('some content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        CorruptedFileException,
      );
    });

    it('should throw CorruptedFileException for DOC file with zero size', () => {
      const file = {
        originalname: 'resume.doc',
        mimetype: 'application/msword',
        size: 0,
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        CorruptedFileException,
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

    it('should throw InvalidFileTypeException when empty object provided', () => {
      expect(() => pipe.transform({} as any, { type: 'body' })).toThrow(
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

    it('should handle file with uppercase extension', () => {
      const file = {
        originalname: 'RESUME.PDF',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should handle file with mixed case extension', () => {
      const file = {
        originalname: 'Resume.Pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should handle file with multiple dots in name', () => {
      const file = {
        originalname: 'john.doe.resume.2024.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should handle file with spaces in name', () => {
      const file = {
        originalname: 'john doe resume.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should handle file with very long name', () => {
      const longName = 'a'.repeat(200) + '.pdf';
      const file = {
        originalname: longName,
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });
  });

  describe('boundary conditions', () => {
    it('should pass file just under max size limit', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES - 1,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should reject file just over max size limit', () => {
      const file = {
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1,
        buffer: Buffer.from('content'),
      } as Express.Multer.File;

      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        FileSizeExceededException,
      );
    });
  });
});
