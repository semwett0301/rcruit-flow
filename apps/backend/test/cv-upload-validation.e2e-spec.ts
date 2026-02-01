/**
 * E2E tests for CV Upload Validation
 *
 * Tests the CV upload endpoint validation including:
 * - File type validation
 * - File size validation
 * - Successful upload scenarios
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CvUploadErrorCode } from '@rcruit-flow/dto';
import { AppModule } from '../src/app.module';

describe('CV Upload Validation (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /cv/upload - File Type Validation', () => {
    it('should reject invalid file type (text/plain) with proper error code', async () => {
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('cv', Buffer.from('test content'), {
          filename: 'test.txt',
          contentType: 'text/plain',
        })
        .expect(400);

      expect(response.body.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
      expect(response.body.details).toBeDefined();
      expect(response.body.details.allowedTypes).toBeDefined();
      expect(Array.isArray(response.body.details.allowedTypes)).toBe(true);
    });

    it('should reject invalid file type (image/png) with proper error code', async () => {
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('cv', Buffer.from('fake image content'), {
          filename: 'image.png',
          contentType: 'image/png',
        })
        .expect(400);

      expect(response.body.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
      expect(response.body.details.allowedTypes).toBeDefined();
    });

    it('should reject file with mismatched extension and content type', async () => {
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('cv', Buffer.from('not a pdf'), {
          filename: 'resume.pdf',
          contentType: 'text/plain',
        })
        .expect(400);

      expect(response.body.code).toBe(CvUploadErrorCode.INVALID_FILE_TYPE);
    });
  });

  describe('POST /cv/upload - File Size Validation', () => {
    it('should reject oversized files (15MB) with proper error code', async () => {
      const largeBuffer = Buffer.alloc(15 * 1024 * 1024); // 15MB
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('cv', largeBuffer, {
          filename: 'large.pdf',
          contentType: 'application/pdf',
        })
        .expect(413);

      expect(response.body.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
      expect(response.body.details).toBeDefined();
      expect(response.body.details.maxSize).toBeDefined();
    });

    it('should reject files slightly over the limit', async () => {
      // Assuming 10MB limit, create 10.1MB file
      const slightlyOverBuffer = Buffer.alloc(10.1 * 1024 * 1024);
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('cv', slightlyOverBuffer, {
          filename: 'slightly-large.pdf',
          contentType: 'application/pdf',
        })
        .expect(413);

      expect(response.body.code).toBe(CvUploadErrorCode.FILE_SIZE_EXCEEDED);
      expect(response.body.details.maxSize).toBeDefined();
    });
  });

  describe('POST /cv/upload - Successful Upload', () => {
    it('should accept valid PDF file', async () => {
      // Create a minimal valid PDF buffer
      const pdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF');
      
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('cv', pdfContent, {
          filename: 'resume.pdf',
          contentType: 'application/pdf',
        })
        .expect(201);

      expect(response.body).toBeDefined();
    });

    it('should accept valid DOCX file', async () => {
      // DOCX files start with PK (ZIP signature)
      const docxContent = Buffer.from('PK\x03\x04');
      
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('cv', docxContent, {
          filename: 'resume.docx',
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
        .expect(201);

      expect(response.body).toBeDefined();
    });

    it('should accept valid DOC file', async () => {
      const docContent = Buffer.from('\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1');
      
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('cv', docContent, {
          filename: 'resume.doc',
          contentType: 'application/msword',
        })
        .expect(201);

      expect(response.body).toBeDefined();
    });

    it('should accept file at maximum allowed size', async () => {
      // Assuming 10MB limit, create exactly 10MB file with PDF header
      const maxSizeBuffer = Buffer.alloc(10 * 1024 * 1024);
      maxSizeBuffer.write('%PDF-1.4', 0);
      
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('cv', maxSizeBuffer, {
          filename: 'max-size.pdf',
          contentType: 'application/pdf',
        })
        .expect(201);

      expect(response.body).toBeDefined();
    });
  });

  describe('POST /cv/upload - Missing File', () => {
    it('should return error when no file is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .expect(400);

      expect(response.body).toBeDefined();
    });

    it('should return error when wrong field name is used', async () => {
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('wrongField', Buffer.from('%PDF-1.4'), {
          filename: 'resume.pdf',
          contentType: 'application/pdf',
        })
        .expect(400);

      expect(response.body).toBeDefined();
    });
  });

  describe('POST /cv/upload - Empty File', () => {
    it('should reject empty file', async () => {
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('cv', Buffer.alloc(0), {
          filename: 'empty.pdf',
          contentType: 'application/pdf',
        })
        .expect(400);

      expect(response.body).toBeDefined();
    });
  });
});
