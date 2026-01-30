/**
 * Unit tests for CandidatesService
 * Tests email update functionality and recruitment email sending
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CandidatesService } from '../candidates.service';
import { Candidate } from '../entities/candidate.entity';

describe('CandidatesService', () => {
  let service: CandidatesService;
  let mockRepository: {
    findOne: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    delete: jest.Mock;
    create: jest.Mock;
  };
  let mockEmailService: {
    send: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };

    mockEmailService = {
      send: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatesService,
        {
          provide: getRepositoryToken(Candidate),
          useValue: mockRepository,
        },
        {
          provide: 'EmailService',
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should update candidate email when provided', async () => {
      const candidateId = 'test-id';
      const updateDto = { email: 'newemail@example.com' };
      const existingCandidate = { id: candidateId, email: 'old@example.com' };

      mockRepository.findOne.mockResolvedValue(existingCandidate);
      mockRepository.save.mockResolvedValue({ ...existingCandidate, ...updateDto });

      const result = await service.update(candidateId, updateDto);

      expect(result.email).toBe('newemail@example.com');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'newemail@example.com' }),
      );
    });

    it('should not modify email when not provided in update', async () => {
      const candidateId = 'test-id';
      const updateDto = { firstName: 'John' };
      const existingCandidate = { id: candidateId, email: 'existing@example.com', firstName: 'Jane' };

      mockRepository.findOne.mockResolvedValue(existingCandidate);
      mockRepository.save.mockResolvedValue({ ...existingCandidate, ...updateDto });

      const result = await service.update(candidateId, updateDto);

      expect(result.email).toBe('existing@example.com');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'existing@example.com' }),
      );
    });

    it('should throw error when candidate not found', async () => {
      const candidateId = 'non-existent-id';
      const updateDto = { email: 'newemail@example.com' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(candidateId, updateDto)).rejects.toThrow();
    });

    it('should handle empty email string', async () => {
      const candidateId = 'test-id';
      const updateDto = { email: '' };
      const existingCandidate = { id: candidateId, email: 'old@example.com' };

      mockRepository.findOne.mockResolvedValue(existingCandidate);
      mockRepository.save.mockResolvedValue({ ...existingCandidate, email: '' });

      const result = await service.update(candidateId, updateDto);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: '' }),
      );
    });
  });

  describe('sendRecruitmentEmail', () => {
    it('should use provided email and update candidate record', async () => {
      const candidateId = 'test-id';
      const emailDto = {
        candidateEmail: 'updated@example.com',
        subject: 'Test',
        body: 'Test body',
      };
      const existingCandidate = { id: candidateId, email: 'original@example.com' };

      mockRepository.findOne.mockResolvedValue(existingCandidate);
      mockRepository.save.mockResolvedValue({ ...existingCandidate, email: emailDto.candidateEmail });

      await service.sendRecruitmentEmail(candidateId, emailDto);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'updated@example.com' }),
      );
      expect(mockEmailService.send).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'updated@example.com' }),
      );
    });

    it('should use existing email when candidateEmail not provided', async () => {
      const candidateId = 'test-id';
      const emailDto = {
        subject: 'Test',
        body: 'Test body',
      };
      const existingCandidate = { id: candidateId, email: 'original@example.com' };

      mockRepository.findOne.mockResolvedValue(existingCandidate);

      await service.sendRecruitmentEmail(candidateId, emailDto);

      expect(mockEmailService.send).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'original@example.com' }),
      );
    });

    it('should throw error when candidate not found', async () => {
      const candidateId = 'non-existent-id';
      const emailDto = {
        candidateEmail: 'test@example.com',
        subject: 'Test',
        body: 'Test body',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.sendRecruitmentEmail(candidateId, emailDto)).rejects.toThrow();
    });

    it('should send email with correct subject and body', async () => {
      const candidateId = 'test-id';
      const emailDto = {
        candidateEmail: 'test@example.com',
        subject: 'Job Opportunity',
        body: 'We have an exciting opportunity for you!',
      };
      const existingCandidate = { id: candidateId, email: 'original@example.com' };

      mockRepository.findOne.mockResolvedValue(existingCandidate);
      mockRepository.save.mockResolvedValue({ ...existingCandidate, email: emailDto.candidateEmail });

      await service.sendRecruitmentEmail(candidateId, emailDto);

      expect(mockEmailService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Job Opportunity',
          body: 'We have an exciting opportunity for you!',
        }),
      );
    });

    it('should handle email service failure gracefully', async () => {
      const candidateId = 'test-id';
      const emailDto = {
        candidateEmail: 'test@example.com',
        subject: 'Test',
        body: 'Test body',
      };
      const existingCandidate = { id: candidateId, email: 'original@example.com' };

      mockRepository.findOne.mockResolvedValue(existingCandidate);
      mockRepository.save.mockResolvedValue({ ...existingCandidate, email: emailDto.candidateEmail });
      mockEmailService.send.mockRejectedValue(new Error('Email service unavailable'));

      await expect(service.sendRecruitmentEmail(candidateId, emailDto)).rejects.toThrow(
        'Email service unavailable',
      );
    });
  });
});
