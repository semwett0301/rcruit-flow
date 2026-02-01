/**
 * Unit tests for CvUploadService error handling
 *
 * Tests various error scenarios including:
 * - Empty/null file uploads
 * - File size limit violations
 * - Invalid file types
 * - Corrupted file detection
 * - Successful upload scenarios
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CvUploadService } from '../src/cv/cv-upload.service';
import { CvUploadException } from '../src/common/exceptions/cv-upload.exception';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

describe('CvUploadService', () => {
  let service: CvUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvUploadService],
    }).compile();

    service = module.get<CvUploadService>(CvUploadService);
  });

  describe('uploadCv', () => {
    describe('empty file validation', () => {
      it('should throw EMPTY_FILE error when file is null', async () => {
        await expect(service.uploadCv(null as any, 'user-1'))
          .rejects
          .toThrow(CvUploadException);
      });

      it('should throw EMPTY_FILE error when file is undefined', async () => {
        await expect(service.uploadCv(undefined as any, 'user-1'))
          .rejects
          .toThrow(CvUploadException);
      });

      it('should throw EMPTY_FILE error when file buffer is empty', async () => {
        const emptyFile = {
          buffer: Buffer.alloc(0),
          size: 0,
          mimetype: 'application/pdf',
          originalname: 'empty.pdf',
        } as Express.Multer.File;

        await expect(service.uploadCv(emptyFile, 'user-1'))
          .rejects
          .toMatchObject({ response: { code: CvUploadErrorCode.EMPTY_FILE } });
      });
    });

    describe('file size validation', () => {
      it('should throw FILE_TOO_LARGE error when file exceeds 10MB limit', async () => {
        const largeFile = {
          buffer: Buffer.alloc(11 * 1024 * 1024),
          size: 11 * 1024 * 1024,
          mimetype: 'application/pdf',
          originalname: 'large.pdf',
        } as Express.Multer.File;

        await expect(service.uploadCv(largeFile, 'user-1'))
          .rejects
          .toMatchObject({ response: { code: CvUploadErrorCode.FILE_TOO_LARGE } });
      });

      it('should throw FILE_TOO_LARGE error when file is exactly at boundary', async () => {
        const boundaryFile = {
          buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
          size: 10 * 1024 * 1024 + 1,
          mimetype: 'application/pdf',
          originalname: 'boundary.pdf',
        } as Express.Multer.File;

        await expect(service.uploadCv(boundaryFile, 'user-1'))
          .rejects
          .toMatchObject({ response: { code: CvUploadErrorCode.FILE_TOO_LARGE } });
      });
    });

    describe('file type validation', () => {
      it('should throw INVALID_FILE_TYPE error for image/png mime type', async () => {
        const invalidFile = {
          buffer: Buffer.from('test'),
          size: 100,
          mimetype: 'image/png',
          originalname: 'image.png',
        } as Express.Multer.File;

        await expect(service.uploadCv(invalidFile, 'user-1'))
          .rejects
          .toMatchObject({ response: { code: CvUploadErrorCode.INVALID_FILE_TYPE } });
      });

      it('should throw INVALID_FILE_TYPE error for image/jpeg mime type', async () => {
        const invalidFile = {
          buffer: Buffer.from('test'),
          size: 100,
          mimetype: 'image/jpeg',
          originalname: 'photo.jpg',
        } as Express.Multer.File;

        await expect(service.uploadCv(invalidFile, 'user-1'))
          .rejects
          .toMatchObject({ response: { code: CvUploadErrorCode.INVALID_FILE_TYPE } });
      });

      it('should throw INVALID_FILE_TYPE error for text/plain mime type', async () => {
        const invalidFile = {
          buffer: Buffer.from('plain text content'),
          size: 100,
          mimetype: 'text/plain',
          originalname: 'document.txt',
        } as Express.Multer.File;

        await expect(service.uploadCv(invalidFile, 'user-1'))
          .rejects
          .toMatchObject({ response: { code: CvUploadErrorCode.INVALID_FILE_TYPE } });
      });

      it('should throw INVALID_FILE_TYPE error for application/zip mime type', async () => {
        const invalidFile = {
          buffer: Buffer.from('zip content'),
          size: 100,
          mimetype: 'application/zip',
          originalname: 'archive.zip',
        } as Express.Multer.File;

        await expect(service.uploadCv(invalidFile, 'user-1'))
          .rejects
          .toMatchObject({ response: { code: CvUploadErrorCode.INVALID_FILE_TYPE } });
      });
    });

    describe('file corruption validation', () => {
      it('should throw FILE_CORRUPTED error for invalid PDF header', async () => {
        const corruptedPdf = {
          buffer: Buffer.from('not a pdf'),
          size: 100,
          mimetype: 'application/pdf',
          originalname: 'test.pdf',
        } as Express.Multer.File;

        await expect(service.uploadCv(corruptedPdf, 'user-1'))
          .rejects
          .toMatchObject({ response: { code: CvUploadErrorCode.FILE_CORRUPTED } });
      });

      it('should throw FILE_CORRUPTED error for PDF with random bytes', async () => {
        const corruptedPdf = {
          buffer: Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04]),
          size: 5,
          mimetype: 'application/pdf',
          originalname: 'corrupted.pdf',
        } as Express.Multer.File;

        await expect(service.uploadCv(corruptedPdf, 'user-1'))
          .rejects
          .toMatchObject({ response: { code: CvUploadErrorCode.FILE_CORRUPTED } });
      });

      it('should throw FILE_CORRUPTED error for PDF with partial header', async () => {
        const corruptedPdf = {
          buffer: Buffer.from('%PD'),
          size: 3,
          mimetype: 'application/pdf',
          originalname: 'partial.pdf',
        } as Express.Multer.File;

        await expect(service.uploadCv(corruptedPdf, 'user-1'))
          .rejects
          .toMatchObject({ response: { code: CvUploadErrorCode.FILE_CORRUPTED } });
      });
    });

    describe('successful upload scenarios', () => {
      it('should successfully upload valid PDF file', async () => {
        const validPdf = {
          buffer: Buffer.from('%PDF-1.4 test content'),
          size: 1000,
          mimetype: 'application/pdf',
          originalname: 'resume.pdf',
        } as Express.Multer.File;

        const result = await service.uploadCv(validPdf, 'user-1');

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('filename', 'resume.pdf');
      });

      it('should successfully upload PDF with version 1.7', async () => {
        const validPdf = {
          buffer: Buffer.from('%PDF-1.7 modern pdf content'),
          size: 2000,
          mimetype: 'application/pdf',
          originalname: 'modern-resume.pdf',
        } as Express.Multer.File;

        const result = await service.uploadCv(validPdf, 'user-2');

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('filename', 'modern-resume.pdf');
      });

      it('should successfully upload file at exactly 10MB limit', async () => {
        const pdfHeader = '%PDF-1.4 ';
        const remainingSize = 10 * 1024 * 1024 - pdfHeader.length;
        const buffer = Buffer.concat([
          Buffer.from(pdfHeader),
          Buffer.alloc(remainingSize),
        ]);

        const maxSizeFile = {
          buffer,
          size: 10 * 1024 * 1024,
          mimetype: 'application/pdf',
          originalname: 'max-size.pdf',
        } as Express.Multer.File;

        const result = await service.uploadCv(maxSizeFile, 'user-1');

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('filename', 'max-size.pdf');
      });
    });

    describe('user ID validation', () => {
      it('should associate upload with correct user ID', async () => {
        const validPdf = {
          buffer: Buffer.from('%PDF-1.4 test content'),
          size: 1000,
          mimetype: 'application/pdf',
          originalname: 'resume.pdf',
        } as Express.Multer.File;

        const result = await service.uploadCv(validPdf, 'user-123');

        expect(result).toHaveProperty('id');
        expect(result.userId || result.ownerId).toBe('user-123');
      });
    });
  });
});
