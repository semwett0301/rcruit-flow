import { Test, TestingModule } from '@nestjs/testing';
import { EmailsController } from './emails.controller';
import { GenerateEmailUseCase } from 'application/email/use-case/generate-email.use-case';
import {
  candidateFormFixture,
  emailResponseFixture,
} from '../../../../test/fixtures/email.fixture';

describe('EmailsController', () => {
  let controller: EmailsController;
  let mockGenerateEmailUseCase: jest.Mocked<GenerateEmailUseCase>;

  beforeEach(async () => {
    mockGenerateEmailUseCase = {
      generate: jest.fn().mockResolvedValue(emailResponseFixture),
    } as unknown as jest.Mocked<GenerateEmailUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailsController],
      providers: [
        {
          provide: GenerateEmailUseCase,
          useValue: mockGenerateEmailUseCase,
        },
      ],
    }).compile();

    controller = module.get<EmailsController>(EmailsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generate', () => {
    it('should generate an email and return the response', async () => {
      const result = await controller.generate(candidateFormFixture);

      expect(result).toEqual(emailResponseFixture);
    });

    it('should call GenerateEmailUseCase.generate with the provided dto', async () => {
      await controller.generate(candidateFormFixture);

      expect(mockGenerateEmailUseCase.generate).toHaveBeenCalledWith(
        candidateFormFixture,
      );
    });

    it('should return the email from the use case', async () => {
      const customResponse = { email: 'Custom email content' };
      mockGenerateEmailUseCase.generate.mockResolvedValue(customResponse);

      const result = await controller.generate(candidateFormFixture);

      expect(result.email).toBe('Custom email content');
    });

    it('should throw an error if email generation fails', async () => {
      mockGenerateEmailUseCase.generate.mockRejectedValue(
        new Error('Email generation failed'),
      );

      await expect(controller.generate(candidateFormFixture)).rejects.toThrow(
        'Email generation failed',
      );
    });

    it('should handle different candidate data', async () => {
      const customCandidate = {
        ...candidateFormFixture,
        candidateName: 'Custom Candidate',
        recruiterName: 'Custom Recruiter',
      };

      await controller.generate(customCandidate);

      expect(mockGenerateEmailUseCase.generate).toHaveBeenCalledWith(
        customCandidate,
      );
    });
  });
});
