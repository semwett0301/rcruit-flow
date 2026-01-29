import { Test, TestingModule } from '@nestjs/testing';
import { SaveCvUseCase } from './save-cv.use-case';
import { S3Service } from 'infrastructure/s3/s3.service';
import { createMockFile } from '../../../../test/fixtures/cv.fixture';

describe('SaveCvUseCase', () => {
  let useCase: SaveCvUseCase;
  let mockS3Service: jest.Mocked<S3Service>;

  beforeEach(async () => {
    mockS3Service = {
      uploadFile: jest.fn().mockResolvedValue('uploaded-file-key'),
      getFile: jest.fn(),
    } as unknown as jest.Mocked<S3Service>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveCvUseCase,
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    useCase = module.get<SaveCvUseCase>(SaveCvUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveCV', () => {
    it('should upload the file to S3 and return the file key', async () => {
      const mockFile = createMockFile();

      const result = await useCase.saveCV(mockFile);

      expect(result).toBe('uploaded-file-key');
      expect(mockS3Service.uploadFile).toHaveBeenCalledWith(mockFile);
    });

    it('should pass the file to S3 service unchanged', async () => {
      const mockFile = createMockFile({
        originalname: 'my-resume.pdf',
        mimetype: 'application/pdf',
        size: 2048,
      });

      await useCase.saveCV(mockFile);

      expect(mockS3Service.uploadFile).toHaveBeenCalledWith(mockFile);
    });

    it('should throw an error if S3 upload fails', async () => {
      const error = new Error('S3 upload failed');
      mockS3Service.uploadFile.mockRejectedValue(error);

      const mockFile = createMockFile();

      await expect(useCase.saveCV(mockFile)).rejects.toThrow(
        'S3 upload failed',
      );
    });

    it('should handle different file types', async () => {
      const docFile = createMockFile({
        originalname: 'resume.docx',
        mimetype:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      mockS3Service.uploadFile.mockResolvedValue('doc-file-key');

      const result = await useCase.saveCV(docFile);

      expect(result).toBe('doc-file-key');
    });
  });
});
