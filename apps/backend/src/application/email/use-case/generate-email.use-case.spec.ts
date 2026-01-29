import { Test, TestingModule } from '@nestjs/testing';
import { GenerateEmailUseCase } from './generate-email.use-case';
import { GptService } from 'infrastructure/gpt/gpt.service';
import { S3Service } from 'infrastructure/s3/s3.service';
import {
  candidateFormFixture,
  emailResponseFixture,
} from '../../../../test/fixtures/email.fixture';
import { TravelModeEnum } from '@repo/dto';

jest.mock('shared/utils/extractTextFromPdf', () => ({
  extractTextFromPdf: jest.fn().mockResolvedValue('Job description text'),
}));

import { extractTextFromPdf } from 'shared/utils/extractTextFromPdf';

const mockedExtractTextFromPdf = extractTextFromPdf as jest.MockedFunction<
  typeof extractTextFromPdf
>;

describe('GenerateEmailUseCase', () => {
  let useCase: GenerateEmailUseCase;
  let mockGptService: jest.Mocked<GptService>;
  let mockS3Service: jest.Mocked<S3Service>;

  beforeEach(async () => {
    mockGptService = {
      chat: jest.fn().mockResolvedValue(emailResponseFixture.email),
    } as unknown as jest.Mocked<GptService>;

    mockS3Service = {
      uploadFile: jest.fn(),
      getFile: jest.fn().mockResolvedValue(Buffer.from('mock job description pdf')),
    } as unknown as jest.Mocked<S3Service>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateEmailUseCase,
        {
          provide: GptService,
          useValue: mockGptService,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    useCase = module.get<GenerateEmailUseCase>(GenerateEmailUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generate', () => {
    it('should generate an email successfully', async () => {
      const result = await useCase.generate({ ...candidateFormFixture });

      expect(result).toHaveProperty('email');
      expect(typeof result.email).toBe('string');
    });

    it('should call GPT service with system and user prompts', async () => {
      await useCase.generate({ ...candidateFormFixture });

      expect(mockGptService.chat).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user' }),
        ]),
      );
    });

    it('should fetch job description from S3 when jobDescriptionFile is provided', async () => {
      const dto = {
        ...candidateFormFixture,
        jobDescriptionFile: 'job-desc-file-id',
      };

      await useCase.generate(dto);

      expect(mockS3Service.getFile).toHaveBeenCalledWith('job-desc-file-id');
      expect(mockedExtractTextFromPdf).toHaveBeenCalled();
    });

    it('should not fetch from S3 when no jobDescriptionFile is provided', async () => {
      const dto = { ...candidateFormFixture };
      delete (dto as Record<string, unknown>).jobDescriptionFile;

      await useCase.generate(dto);

      expect(mockS3Service.getFile).not.toHaveBeenCalled();
    });

    it('should determine Junior seniority for less than 3 years of experience', async () => {
      const dto = { ...candidateFormFixture, yearsOfExperience: 2 };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('Junior');
    });

    it('should determine Medior seniority for 3-4 years of experience', async () => {
      const dto = { ...candidateFormFixture, yearsOfExperience: 4 };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('Medior');
    });

    it('should determine Senior seniority for 5+ years of experience', async () => {
      const dto = { ...candidateFormFixture, yearsOfExperience: 5 };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('Senior');
    });

    it('should extract first name from candidate name', async () => {
      const dto = { ...candidateFormFixture, candidateName: 'John William Doe' };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('John');
    });

    it('should handle remote travel option correctly', async () => {
      const dto = {
        ...candidateFormFixture,
        travelOptions: [{ travelMode: TravelModeEnum.REMOTE }],
      };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('only remote');
    });

    it('should handle empty travel options', async () => {
      const dto = { ...candidateFormFixture, travelOptions: [] };

      await useCase.generate(dto);

      expect(mockGptService.chat).toHaveBeenCalled();
    });

    it('should handle car travel option with minutes and on-site days', async () => {
      const dto = {
        ...candidateFormFixture,
        travelOptions: [
          { travelMode: TravelModeEnum.CAR, minutesOfRoad: 45, onSiteDays: 3 },
        ],
      };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('45 minutes by Car');
      expect(userPrompt).toContain('3 on-site days');
    });

    it('should handle multiple travel options', async () => {
      const dto = {
        ...candidateFormFixture,
        travelOptions: [
          { travelMode: TravelModeEnum.CAR, minutesOfRoad: 30, onSiteDays: 2 },
          { travelMode: TravelModeEnum.PUBLIC, minutesOfRoad: 60, onSiteDays: 3 },
        ],
      };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('or');
    });

    it('should handle travel option without minutesOfRoad', async () => {
      const dto = {
        ...candidateFormFixture,
        travelOptions: [{ travelMode: TravelModeEnum.BICYCLE, onSiteDays: 2 }],
      };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('0 minutes by Bicycle');
    });

    it('should handle travel option without onSiteDays', async () => {
      const dto = {
        ...candidateFormFixture,
        travelOptions: [{ travelMode: TravelModeEnum.WALK, minutesOfRoad: 15 }],
      };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('0 on-site days');
    });

    it('should format yearly salary correctly', async () => {
      const dto = { ...candidateFormFixture, salaryPeriod: 'year' as const };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('all-in per year');
    });

    it('should format monthly salary correctly', async () => {
      const dto = { ...candidateFormFixture, salaryPeriod: 'Month' as const };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('gross / month');
    });

    it('should handle exactly 3 years of experience as Medior', async () => {
      const dto = { ...candidateFormFixture, yearsOfExperience: 3 };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('Medior');
    });

    it('should handle 0 years of experience as Junior', async () => {
      const dto = { ...candidateFormFixture, yearsOfExperience: 0 };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('Junior');
    });

    it('should handle single-word candidate name', async () => {
      const dto = { ...candidateFormFixture, candidateName: 'Madonna' };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('Madonna');
    });

    it('should handle candidate name with hyphen', async () => {
      const dto = { ...candidateFormFixture, candidateName: 'Mary-Jane Watson' };

      await useCase.generate(dto);

      const userPrompt = mockGptService.chat.mock.calls[0][0][1].content;
      expect(userPrompt).toContain('Mary-Jane');
    });

    it('should throw an error if GPT call fails', async () => {
      mockGptService.chat.mockRejectedValue(new Error('GPT service unavailable'));

      await expect(useCase.generate({ ...candidateFormFixture })).rejects.toThrow(
        'GPT service unavailable',
      );
    });

    it('should throw an error if S3 file retrieval fails', async () => {
      mockS3Service.getFile.mockRejectedValue(new Error('S3 error'));

      const dto = {
        ...candidateFormFixture,
        jobDescriptionFile: 'job-desc-file-id',
      };

      await expect(useCase.generate(dto)).rejects.toThrow('S3 error');
    });
  });
});
