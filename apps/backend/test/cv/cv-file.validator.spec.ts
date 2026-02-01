/**
 * Unit tests for CvFileValidator
 * Tests file validation logic including mime type, file size, and buffer integrity checks
 */
import { CvFileValidator } from '../../src/cv/validators/cv-file.validator';
import {
  InvalidFileTypeException,
  FileSizeExceededException,
  FileCorruptedException,
} from '../../src/cv/exceptions/cv-upload.exception';
import { CV_UPLOAD_CONSTRAINTS } from '@repo/dto';

describe('CvFileValidator', () => {
  let validator: CvFileValidator;

  beforeEach(() => {
    validator = new CvFileValidator();
  });

  describe('validateFile', () => {
    describe('mime type validation', () => {
      it('should throw InvalidFileTypeException for unsupported mime type', () => {
        const file = {
          mimetype: 'image/png',
          size: 1000,
          buffer: Buffer.from('%PDF-test'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).toThrow(
          InvalidFileTypeException,
        );
      });

      it('should throw InvalidFileTypeException for image/jpeg mime type', () => {
        const file = {
          mimetype: 'image/jpeg',
          size: 1000,
          buffer: Buffer.from('%PDF-test'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).toThrow(
          InvalidFileTypeException,
        );
      });

      it('should throw InvalidFileTypeException for text/plain mime type', () => {
        const file = {
          mimetype: 'text/plain',
          size: 1000,
          buffer: Buffer.from('plain text content'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).toThrow(
          InvalidFileTypeException,
        );
      });

      it('should accept application/pdf mime type', () => {
        const file = {
          mimetype: 'application/pdf',
          size: 1000,
          buffer: Buffer.from('%PDF-1.4 test content'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).not.toThrow();
      });
    });

    describe('file size validation', () => {
      it('should throw FileSizeExceededException when file exceeds max size', () => {
        const file = {
          mimetype: 'application/pdf',
          size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1,
          buffer: Buffer.from('%PDF-test'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).toThrow(
          FileSizeExceededException,
        );
      });

      it('should throw FileSizeExceededException when file is exactly at max size + 1 byte', () => {
        const file = {
          mimetype: 'application/pdf',
          size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1,
          buffer: Buffer.from('%PDF-1.4 test'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).toThrow(
          FileSizeExceededException,
        );
      });

      it('should pass validation when file is exactly at max size', () => {
        const file = {
          mimetype: 'application/pdf',
          size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
          buffer: Buffer.from('%PDF-1.4 test content'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).not.toThrow();
      });

      it('should pass validation when file is under max size', () => {
        const file = {
          mimetype: 'application/pdf',
          size: 1000,
          buffer: Buffer.from('%PDF-1.4 test content'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).not.toThrow();
      });
    });

    describe('buffer integrity validation', () => {
      it('should throw FileCorruptedException for empty buffer', () => {
        const file = {
          mimetype: 'application/pdf',
          size: 0,
          buffer: Buffer.from(''),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).toThrow(
          FileCorruptedException,
        );
      });

      it('should throw FileCorruptedException for null buffer', () => {
        const file = {
          mimetype: 'application/pdf',
          size: 1000,
          buffer: null,
        } as unknown as Express.Multer.File;

        expect(() => validator.validateFile(file)).toThrow(
          FileCorruptedException,
        );
      });

      it('should throw FileCorruptedException for undefined buffer', () => {
        const file = {
          mimetype: 'application/pdf',
          size: 1000,
          buffer: undefined,
        } as unknown as Express.Multer.File;

        expect(() => validator.validateFile(file)).toThrow(
          FileCorruptedException,
        );
      });
    });

    describe('valid file scenarios', () => {
      it('should pass validation for valid PDF file', () => {
        const file = {
          mimetype: 'application/pdf',
          size: 1000,
          buffer: Buffer.from('%PDF-1.4 test content'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).not.toThrow();
      });

      it('should pass validation for valid PDF file with minimal content', () => {
        const file = {
          mimetype: 'application/pdf',
          size: 10,
          buffer: Buffer.from('%PDF-1.0'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).not.toThrow();
      });

      it('should pass validation for valid PDF file with large content under limit', () => {
        const file = {
          mimetype: 'application/pdf',
          size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES - 1000,
          buffer: Buffer.from('%PDF-1.7 large content here'),
        } as Express.Multer.File;

        expect(() => validator.validateFile(file)).not.toThrow();
      });
    });
  });
});
