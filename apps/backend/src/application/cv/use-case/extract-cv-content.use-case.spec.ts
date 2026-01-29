import { Test, TestingModule } from '@nestjs/testing';
import { ExtractCvContentUseCase } from './extract-cv-content.use-case';
import { S3Service } from 'infrastructure/s3/s3.service';
import { GptService } from 'infrastructure/gpt/gpt.service';
import {
  extractCvDataRequestFixture,
  extractCvDataResultFixture,
} from '../../../../test/fixtures/cv.fixture';

jest.mock('shared/utils/extractTextFromPdf', () => ({
  extractTextFromPdf: jest.fn().mockResolvedValue('Extracted CV text content'),
}));

import { extractTextFromPdf } from 'shared/utils/extractTextFromPdf';

const mockedExtractTextFromPdf = extractTextFromPdf as jest.MockedFunction<
  typeof extractTextFromPdf
>;

describe('ExtractCvContentUseCase', () => {
  let useCase: ExtractCvContentUseCase;
  let mockS3Service: jest.Mocked<S3Service>;
  let mockGptService: jest.Mocked<GptService>;

  beforeEach(async () => {
    mockS3Service = {
      uploadFile: jest.fn(),
      getFile: jest.fn().mockResolvedValue(Buffer.from('mock pdf content')),
    } as unknown as jest.Mocked<S3Service>;

    mockGptService = {
      chat: jest
        .fn()
        .mockResolvedValue(JSON.stringify(extractCvDataResultFixture)),
    } as unknown as jest.Mocked<GptService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExtractCvContentUseCase,
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
        {
          provide: GptService,
          useValue: mockGptService,
        },
      ],
    }).compile();

    useCase = module.get<ExtractCvContentUseCase>(ExtractCvContentUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractData', () => {
    it('should extract CV data successfully', async () => {
      const result = await useCase.extractData(extractCvDataRequestFixture);

      expect(result).toEqual(extractCvDataResultFixture);
    });

    it('should fetch the file from S3 using the provided fileId', async () => {
      await useCase.extractData(extractCvDataRequestFixture);

      expect(mockS3Service.getFile).toHaveBeenCalledWith(
        extractCvDataRequestFixture.fileId,
      );
    });

    it('should extract text from the PDF buffer', async () => {
      await useCase.extractData(extractCvDataRequestFixture);

      expect(mockedExtractTextFromPdf).toHaveBeenCalledWith(
        Buffer.from('mock pdf content'),
      );
    });

    it('should send the extracted text to GPT for processing', async () => {
      await useCase.extractData(extractCvDataRequestFixture);

      expect(mockGptService.chat).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user' }),
        ]),
        { temperature: 0 },
      );
    });

    it('should throw an error if S3 file retrieval fails', async () => {
      mockS3Service.getFile.mockRejectedValue(new Error('File not found'));

      await expect(
        useCase.extractData(extractCvDataRequestFixture),
      ).rejects.toThrow('File not found');
    });

    it('should throw an error if PDF extraction fails', async () => {
      mockedExtractTextFromPdf.mockRejectedValueOnce(
        new Error('PDF parsing failed'),
      );

      await expect(
        useCase.extractData(extractCvDataRequestFixture),
      ).rejects.toThrow('PDF parsing failed');
    });

    it('should throw an error if GPT call fails', async () => {
      mockGptService.chat.mockRejectedValue(new Error('OpenAI error'));

      await expect(
        useCase.extractData(extractCvDataRequestFixture),
      ).rejects.toThrow('OpenAI error');
    });

    it('should throw an error if GPT returns invalid JSON', async () => {
      mockGptService.chat.mockResolvedValue('not valid json');

      await expect(
        useCase.extractData(extractCvDataRequestFixture),
      ).rejects.toThrow(/Failed to parse GPT response as JSON/);
    });
  });
});
