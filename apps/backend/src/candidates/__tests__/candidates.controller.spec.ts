/**
 * Unit tests for CandidatesController
 * Tests the candidate email update endpoint functionality
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from '../candidates.controller';
import { CandidatesService } from '../candidates.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;

  const mockCandidatesService = {
    updateEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: mockCandidatesService,
        },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateEmail', () => {
    const candidateId = '1';
    const newEmail = 'new@example.com';

    it('should update candidate email successfully', async () => {
      const mockCandidate = {
        id: candidateId,
        email: newEmail,
        firstName: 'John',
        lastName: 'Doe',
      };
      jest.spyOn(service, 'updateEmail').mockResolvedValue(mockCandidate as any);

      const result = await controller.updateEmail(candidateId, { email: newEmail });

      expect(service.updateEmail).toHaveBeenCalledWith(candidateId, newEmail);
      expect(service.updateEmail).toHaveBeenCalledTimes(1);
      expect(result.email).toBe(newEmail);
      expect(result.id).toBe(candidateId);
    });

    it('should throw NotFoundException when candidate does not exist', async () => {
      jest.spyOn(service, 'updateEmail').mockRejectedValue(
        new NotFoundException(`Candidate with ID ${candidateId} not found`),
      );

      await expect(
        controller.updateEmail(candidateId, { email: newEmail }),
      ).rejects.toThrow(NotFoundException);

      expect(service.updateEmail).toHaveBeenCalledWith(candidateId, newEmail);
    });

    it('should throw BadRequestException for invalid email format', async () => {
      const invalidEmail = 'invalid-email';
      jest.spyOn(service, 'updateEmail').mockRejectedValue(
        new BadRequestException('Invalid email format'),
      );

      await expect(
        controller.updateEmail(candidateId, { email: invalidEmail }),
      ).rejects.toThrow(BadRequestException);

      expect(service.updateEmail).toHaveBeenCalledWith(candidateId, invalidEmail);
    });

    it('should throw BadRequestException when email is already in use', async () => {
      const duplicateEmail = 'existing@example.com';
      jest.spyOn(service, 'updateEmail').mockRejectedValue(
        new BadRequestException('Email already in use'),
      );

      await expect(
        controller.updateEmail(candidateId, { email: duplicateEmail }),
      ).rejects.toThrow(BadRequestException);

      expect(service.updateEmail).toHaveBeenCalledWith(candidateId, duplicateEmail);
    });

    it('should handle empty email string', async () => {
      const emptyEmail = '';
      jest.spyOn(service, 'updateEmail').mockRejectedValue(
        new BadRequestException('Email cannot be empty'),
      );

      await expect(
        controller.updateEmail(candidateId, { email: emptyEmail }),
      ).rejects.toThrow(BadRequestException);

      expect(service.updateEmail).toHaveBeenCalledWith(candidateId, emptyEmail);
    });

    it('should update email with different candidate IDs', async () => {
      const differentCandidateId = '999';
      const mockCandidate = {
        id: differentCandidateId,
        email: newEmail,
      };
      jest.spyOn(service, 'updateEmail').mockResolvedValue(mockCandidate as any);

      const result = await controller.updateEmail(differentCandidateId, { email: newEmail });

      expect(service.updateEmail).toHaveBeenCalledWith(differentCandidateId, newEmail);
      expect(result.id).toBe(differentCandidateId);
    });
  });
});
