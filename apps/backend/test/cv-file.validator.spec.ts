/**
 * Unit tests for CV file validator
 * Tests validation of CV file uploads including MIME type, size, and content validation
 */
import { validateCvFile, validateCvFileContent } from '../src/common/validators/cv-file.validator';
import { CvUploadException } from '../src/common/exceptions/cv-upload.exception';
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

describe('validateCvFile', () => {
  /**
   * Helper function to create a mock Express.Multer.File object
   * @param overrides - Partial file properties to override defaults
   * @returns Mock file object
   */
  const createMockFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File => ({
    fieldname: 'cv',
    originalname: 'resume.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 1024,
    buffer: Buffer.from(''),
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
    ...overrides
  });

  describe('valid files', () => {
    it('accepts valid PDF file', () => {
      const file = createMockFile();
      expect(() => validateCvFile(file)).not.toThrow();
    });

    it('accepts valid DOCX file', () => {
      const file = createMockFile({
        originalname: 'resume.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      expect(() => validateCvFile(file)).not.toThrow();
    });

    it('accepts valid DOC file', () => {
      const file = createMockFile({
        originalname: 'resume.doc',
        mimetype: 'application/msword'
      });
      expect(() => validateCvFile(file)).not.toThrow();
    });

    it('accepts file at exactly max size limit', () => {
      const file = createMockFile({
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES
      });
      expect(() => validateCvFile(file)).not.toThrow();
    });

    it('accepts file with minimum size', () => {
      const file = createMockFile({
        size: 1
      });
      expect(() => validateCvFile(file)).not.toThrow();
    });
  });

  describe('invalid MIME types', () => {
    it('throws for plain text file', () => {
      const file = createMockFile({
        originalname: 'resume.txt',
        mimetype: 'text/plain'
      });
      expect(() => validateCvFile(file)).toThrow(CvUploadException);
    });

    it('throws for image file', () => {
      const file = createMockFile({
        originalname: 'resume.png',
        mimetype: 'image/png'
      });
      expect(() => validateCvFile(file)).toThrow(CvUploadException);
    });

    it('throws for HTML file', () => {
      const file = createMockFile({
        originalname: 'resume.html',
        mimetype: 'text/html'
      });
      expect(() => validateCvFile(file)).toThrow(CvUploadException);
    });

    it('throws for executable file', () => {
      const file = createMockFile({
        originalname: 'resume.exe',
        mimetype: 'application/x-msdownload'
      });
      expect(() => validateCvFile(file)).toThrow(CvUploadException);
    });

    it('throws for ZIP file', () => {
      const file = createMockFile({
        originalname: 'resume.zip',
        mimetype: 'application/zip'
      });
      expect(() => validateCvFile(file)).toThrow(CvUploadException);
    });
  });

  describe('invalid file sizes', () => {
    it('throws for file exceeding size limit', () => {
      const file = createMockFile({
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES + 1
      });
      expect(() => validateCvFile(file)).toThrow(CvUploadException);
    });

    it('throws for file significantly exceeding size limit', () => {
      const file = createMockFile({
        size: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES * 2
      });
      expect(() => validateCvFile(file)).toThrow(CvUploadException);
    });

    it('throws for zero-size file', () => {
      const file = createMockFile({
        size: 0
      });
      expect(() => validateCvFile(file)).toThrow(CvUploadException);
    });
  });

  describe('edge cases', () => {
    it('throws when file is undefined', () => {
      expect(() => validateCvFile(undefined as any)).toThrow(CvUploadException);
    });

    it('throws when file is null', () => {
      expect(() => validateCvFile(null as any)).toThrow(CvUploadException);
    });

    it('handles file with uppercase extension', () => {
      const file = createMockFile({
        originalname: 'RESUME.PDF',
        mimetype: 'application/pdf'
      });
      expect(() => validateCvFile(file)).not.toThrow();
    });

    it('handles file with mixed case extension', () => {
      const file = createMockFile({
        originalname: 'Resume.Pdf',
        mimetype: 'application/pdf'
      });
      expect(() => validateCvFile(file)).not.toThrow();
    });
  });
});

describe('validateCvFileContent', () => {
  describe('valid content', () => {
    it('accepts valid PDF content', async () => {
      const pdfBuffer = Buffer.from('%PDF-1.4 test content');
      await expect(validateCvFileContent(pdfBuffer)).resolves.not.toThrow();
    });

    it('accepts PDF with different version', async () => {
      const pdfBuffer = Buffer.from('%PDF-1.7 test content');
      await expect(validateCvFileContent(pdfBuffer)).resolves.not.toThrow();
    });

    it('accepts valid DOCX content (ZIP signature)', async () => {
      // DOCX files start with PK (ZIP signature)
      const docxBuffer = Buffer.from('PK\x03\x04 test content');
      await expect(validateCvFileContent(docxBuffer)).resolves.not.toThrow();
    });
  });

  describe('invalid content', () => {
    it('throws for invalid content', async () => {
      const invalidBuffer = Buffer.from('not a valid document');
      await expect(validateCvFileContent(invalidBuffer)).rejects.toThrow(CvUploadException);
    });

    it('throws for empty buffer', async () => {
      const emptyBuffer = Buffer.from('');
      await expect(validateCvFileContent(emptyBuffer)).rejects.toThrow(CvUploadException);
    });

    it('throws for buffer with only whitespace', async () => {
      const whitespaceBuffer = Buffer.from('   \n\t  ');
      await expect(validateCvFileContent(whitespaceBuffer)).rejects.toThrow(CvUploadException);
    });

    it('throws for HTML content disguised as PDF', async () => {
      const htmlBuffer = Buffer.from('<html><body>Fake PDF</body></html>');
      await expect(validateCvFileContent(htmlBuffer)).rejects.toThrow(CvUploadException);
    });

    it('throws for JavaScript content', async () => {
      const jsBuffer = Buffer.from('function malicious() { alert("xss"); }');
      await expect(validateCvFileContent(jsBuffer)).rejects.toThrow(CvUploadException);
    });
  });

  describe('edge cases', () => {
    it('throws when buffer is undefined', async () => {
      await expect(validateCvFileContent(undefined as any)).rejects.toThrow(CvUploadException);
    });

    it('throws when buffer is null', async () => {
      await expect(validateCvFileContent(null as any)).rejects.toThrow(CvUploadException);
    });
  });
});
