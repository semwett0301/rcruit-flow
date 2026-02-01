/**
 * Unit tests for CvUploadException class
 * Tests all static factory methods for creating CV upload related exceptions
 */
import { CvUploadException } from '../src/common/exceptions/cv-upload.exception';
import { CvUploadErrorCode, CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';
import { HttpStatus } from '@nestjs/common';

describe('CvUploadException', () => {
  describe('invalidFileType', () => {
    it('creates exception with correct code and status', () => {
      const exception = CvUploadException.invalidFileType();

      expect(exception.getStatus()).toBe(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
      const response = exception.getResponse() as any;
      expect(response.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
      expect(response.details.allowedTypes).toEqual(CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS);
    });
  });

  describe('fileSizeExceeded', () => {
    it('creates exception with correct code and status', () => {
      const exception = CvUploadException.fileSizeExceeded();

      expect(exception.getStatus()).toBe(HttpStatus.PAYLOAD_TOO_LARGE);
      const response = exception.getResponse() as any;
      expect(response.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
      expect(response.details.maxSize).toBe(CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB);
    });
  });

  describe('fileCorrupted', () => {
    it('creates exception with correct code and status', () => {
      const exception = CvUploadException.fileCorrupted();

      expect(exception.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      const response = exception.getResponse() as any;
      expect(response.code).toBe(CvUploadErrorCode.FILE_CORRUPTED);
      expect(response.details.retryable).toBe(false);
    });
  });

  describe('serverError', () => {
    it('creates exception with correct code and status', () => {
      const exception = CvUploadException.serverError();

      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      const response = exception.getResponse() as any;
      expect(response.code).toBe(CvUploadErrorCode.SERVER_ERROR);
      expect(response.details.retryable).toBe(true);
    });
  });
});
