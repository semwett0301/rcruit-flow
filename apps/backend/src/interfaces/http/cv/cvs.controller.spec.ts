import { Test, TestingModule } from '@nestjs/testing';
import { CvsController } from './cvs.controller';
import { ExtractCvContentUseCase } from 'application/cv/use-case/extract-cv-content.use-case';
import { SaveCvUseCase } from 'application/cv/use-case/save-cv.use-case';
import {
  createMockFile,
  extractCvDataRequestFixture,
  extractCvDataResultFixture,
} from '../../../../test/fixtures/cv.fixture';

describe('CvsController', () => {
  let controller: CvsController;
  let mockExtractCvContentUseCase: jest.Mocked<ExtractCvContentUseCase>;
  let mockSaveCvUseCase: jest.Mocked<SaveCvUseCase>;

  beforeEach(async () => {
    mockExtractCvContentUseCase = {
      extractData: jest.fn().mockResolvedValue(extractCvDataResultFixture),
    } as unknown as jest.Mocked<ExtractCvContentUseCase>;

    mockSaveCvUseCase = {
      saveCV: jest.fn().mockResolvedValue('uploaded-file-key'),
    } as unknown as jest.Mocked<SaveCvUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvsController],
      providers: [
        {
          provide: ExtractCvContentUseCase,
          useValue: mockExtractCvContentUseCase,
        },
        {
          provide: SaveCvUseCase,
          useValue: mockSaveCvUseCase,
        },
      ],
    }).compile();

    controller = module.get<CvsController>(CvsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload a file and return success response', async () => {
      const mockFile = createMockFile();

      const result = await controller.uploadFile(mockFile);

      expect(result).toEqual({
        message: 'File uploaded',
        key: 'uploaded-file-key',
      });
    });

    it('should call SaveCvUseCase.saveCV with the uploaded file', async () => {
      const mockFile = createMockFile();

      await controller.uploadFile(mockFile);

      expect(mockSaveCvUseCase.saveCV).toHaveBeenCalledWith(mockFile);
    });

    it('should return the key from the use case', async () => {
      mockSaveCvUseCase.saveCV.mockResolvedValue('custom-key-12345');
      const mockFile = createMockFile();

      const result = await controller.uploadFile(mockFile);

      expect(result.key).toBe('custom-key-12345');
    });

    it('should throw an error if upload fails', async () => {
      mockSaveCvUseCase.saveCV.mockRejectedValue(new Error('Upload failed'));
      const mockFile = createMockFile();

      await expect(controller.uploadFile(mockFile)).rejects.toThrow(
        'Upload failed',
      );
    });
  });

  describe('extractCvData', () => {
    it('should extract CV data and return the result', async () => {
      const result = await controller.extractCvData(extractCvDataRequestFixture);

      expect(result).toEqual(extractCvDataResultFixture);
    });

    it('should call ExtractCvContentUseCase.extractData with the provided dto', async () => {
      await controller.extractCvData(extractCvDataRequestFixture);

      expect(mockExtractCvContentUseCase.extractData).toHaveBeenCalledWith(
        extractCvDataRequestFixture,
      );
    });

    it('should throw an error if extraction fails', async () => {
      mockExtractCvContentUseCase.extractData.mockRejectedValue(
        new Error('Extraction failed'),
      );

      await expect(
        controller.extractCvData(extractCvDataRequestFixture),
      ).rejects.toThrow('Extraction failed');
    });

    it('should handle different fileIds', async () => {
      const customRequest = { fileId: 'custom-file-id' };

      await controller.extractCvData(customRequest);

      expect(mockExtractCvContentUseCase.extractData).toHaveBeenCalledWith(
        customRequest,
      );
    });
  });
});
