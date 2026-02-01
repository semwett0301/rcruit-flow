/**
 * Unit tests for CvFileValidationPipe
 *
 * Tests the validation logic for CV file uploads including:
 * - Valid file type acceptance (PDF, DOC, DOCX)
 * - Invalid file type rejection
 * - File size validation
 * - Corrupted/empty file detection
 */
import { CvFileValidationPipe } from '../cv-file-validation.pipe';
import {
  InvalidFileTypeException,
  FileSizeExceededException,
  CorruptedFileException,
} from '../../exceptions/cv-upload.exception';
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

describe('CvFileValidationPipe', () => {
  let pipe: CvFileValidationPipe;

  beforeEach(() => {
    pipe = new CvFileValidationPipe();
  });

  /**
   * Helper function to create mock Multer file objects for testing
   */
  const createMockFile = (
    overrides: Partial<Express.Multer.File> = {},
  ): Express.Multer.File => ({
    fieldname: 'cv',
    originalname: 'resume.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 1024,
    buffer: Buffer.from('test'),
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
    ...overrides,
  });

  describe('valid file types', () => {
    it('should pass valid PDF files', () => {
      const file = createMockFile();
      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should pass valid DOC files', () => {
      const file = createMockFile({
        mimetype: 'application/msword',
        originalname: 'resume.doc',
      });
      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should pass valid DOCX files', () => {
      const file = createMockFile({
        mimetype:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        originalname: 'resume.docx',
      });
      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });
  });

  describe('invalid file types', () => {
    it('should throw InvalidFileTypeException for unsupported types', () => {
      const file = createMockFile({
        mimetype: 'image/png',
        originalname: 'image.png',
      });
      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException for text files', () => {
      const file = createMockFile({
        mimetype: 'text/plain',
        originalname: 'resume.txt',
      });
      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException for executable files', () => {
      const file = createMockFile({
        mimetype: 'application/x-msdownload',
        originalname: 'malware.exe',
      });
      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        InvalidFileTypeException,
      );
    });
  });

  describe('file size validation', () => {
    it('should throw FileSizeExceededException for large files', () => {
      const file = createMockFile({
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1,
      });
      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        FileSizeExceededException,
      );
    });

    it('should pass files at exactly the max size limit', () => {
      const file = createMockFile({
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
      });
      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });

    it('should pass files under the max size limit', () => {
      const file = createMockFile({
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES - 1,
      });
      expect(pipe.transform(file, { type: 'body' })).toBe(file);
    });
  });

  describe('corrupted/empty file detection', () => {
    it('should throw CorruptedFileException for empty files', () => {
      const file = createMockFile({ size: 0 });
      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        CorruptedFileException,
      );
    });

    it('should throw CorruptedFileException when file is null', () => {
      expect(() => pipe.transform(null as any, { type: 'body' })).toThrow(
        CorruptedFileException,
      );
    });

    it('should throw CorruptedFileException when file is undefined', () => {
      expect(() => pipe.transform(undefined as any, { type: 'body' })).toThrow(
        CorruptedFileException,
      );
    });

    it('should throw CorruptedFileException when buffer is empty', () => {
      const file = createMockFile({
        size: 1024,
        buffer: Buffer.alloc(0),
      });
      expect(() => pipe.transform(file, { type: 'body' })).toThrow(
        CorruptedFileException,
      );
    });
  });

  describe('argument metadata handling', () => {
    it('should handle different argument types', () => {
      const file = createMockFile();
      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
      expect(pipe.transform(file, { type: 'param' })).toBe(file);
      expect(pipe.transform(file, { type: 'query' })).toBe(file);
    });
  });
});
