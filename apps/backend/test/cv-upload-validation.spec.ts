/**
 * Unit tests for CV file upload validation pipe
 * Tests file type validation, size constraints, and error handling
 */
import { CvFileValidationPipe } from '../src/common/pipes/cv-file-validation.pipe';
import {
  InvalidFileTypeException,
  FileSizeExceededException,
} from '../src/common/exceptions/cv-upload.exception';
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

describe('CvFileValidationPipe', () => {
  let pipe: CvFileValidationPipe;

  beforeEach(() => {
    pipe = new CvFileValidationPipe();
  });

  /**
   * Helper function to create mock Multer file objects for testing
   * @param overrides - Partial file properties to override defaults
   * @returns Mock Express.Multer.File object
   */
  const createMockFile = (
    overrides: Partial<Express.Multer.File> = {},
  ): Express.Multer.File => ({
    fieldname: 'cv',
    originalname: 'resume.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 1024 * 1024, // 1MB default
    buffer: Buffer.from(''),
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
    ...overrides,
  });

  describe('Valid file uploads', () => {
    it('should pass valid PDF file', () => {
      const file = createMockFile();
      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });

    it('should pass valid DOCX file', () => {
      const file = createMockFile({
        originalname: 'resume.docx',
        mimetype:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });

    it('should pass valid DOC file', () => {
      const file = createMockFile({
        originalname: 'resume.doc',
        mimetype: 'application/msword',
      });
      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });

    it('should pass file at exactly max size limit', () => {
      const file = createMockFile({
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
      });
      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });

    it('should pass small file', () => {
      const file = createMockFile({ size: 1024 }); // 1KB
      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });
  });

  describe('Invalid file type handling', () => {
    it('should throw InvalidFileTypeException for unsupported mime type', () => {
      const file = createMockFile({
        mimetype: 'image/png',
        originalname: 'image.png',
      });
      expect(() => pipe.transform(file, { type: 'custom' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException for image/jpeg', () => {
      const file = createMockFile({
        mimetype: 'image/jpeg',
        originalname: 'photo.jpg',
      });
      expect(() => pipe.transform(file, { type: 'custom' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException for text/plain', () => {
      const file = createMockFile({
        mimetype: 'text/plain',
        originalname: 'notes.txt',
      });
      expect(() => pipe.transform(file, { type: 'custom' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException for application/zip', () => {
      const file = createMockFile({
        mimetype: 'application/zip',
        originalname: 'archive.zip',
      });
      expect(() => pipe.transform(file, { type: 'custom' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException for executable files', () => {
      const file = createMockFile({
        mimetype: 'application/x-msdownload',
        originalname: 'malware.exe',
      });
      expect(() => pipe.transform(file, { type: 'custom' })).toThrow(
        InvalidFileTypeException,
      );
    });
  });

  describe('File size validation', () => {
    it('should throw FileSizeExceededException for large files', () => {
      const file = createMockFile({
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1,
      });
      expect(() => pipe.transform(file, { type: 'custom' })).toThrow(
        FileSizeExceededException,
      );
    });

    it('should throw FileSizeExceededException for very large files', () => {
      const file = createMockFile({
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES * 10,
      });
      expect(() => pipe.transform(file, { type: 'custom' })).toThrow(
        FileSizeExceededException,
      );
    });
  });

  describe('Missing or null file handling', () => {
    it('should throw InvalidFileTypeException when no file provided', () => {
      expect(() => pipe.transform(null as any, { type: 'custom' })).toThrow(
        InvalidFileTypeException,
      );
    });

    it('should throw InvalidFileTypeException when undefined file provided', () => {
      expect(() =>
        pipe.transform(undefined as any, { type: 'custom' }),
      ).toThrow(InvalidFileTypeException);
    });
  });

  describe('Edge cases', () => {
    it('should handle file with empty buffer', () => {
      const file = createMockFile({
        buffer: Buffer.from(''),
        size: 0,
      });
      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });

    it('should handle file with special characters in name', () => {
      const file = createMockFile({
        originalname: 'my résumé (2024).pdf',
      });
      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });

    it('should handle file with uppercase extension', () => {
      const file = createMockFile({
        originalname: 'RESUME.PDF',
        mimetype: 'application/pdf',
      });
      expect(pipe.transform(file, { type: 'custom' })).toBe(file);
    });
  });
});
