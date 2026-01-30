/**
 * Unit tests for EmailService validation
 * Tests email generation functionality and input validation
 */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EmailService } from '../../src/email/email.service';
import { GenerateEmailDto } from '../../src/email/dto/generate-email.dto';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  describe('generateEmail', () => {
    describe('successful email generation', () => {
      it('should generate email when all required fields are present', async () => {
        const input: GenerateEmailDto = {
          candidate: { name: 'John Doe', email: 'john@example.com' },
          jobDescription: { title: 'Software Engineer', description: 'Build amazing software' },
        };

        const result = await service.generateEmail(input);

        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('subject');
      });

      it('should generate email with valid candidate and job details', async () => {
        const input: GenerateEmailDto = {
          candidate: { name: 'Jane Smith', email: 'jane.smith@company.org' },
          jobDescription: { title: 'Senior Developer', description: 'Lead development team' },
        };

        const result = await service.generateEmail(input);

        expect(result).toBeDefined();
        expect(typeof result.email).toBe('string');
        expect(typeof result.subject).toBe('string');
      });
    });

    describe('candidate validation', () => {
      it('should throw BadRequestException when candidate name is missing', async () => {
        const input = {
          candidate: { name: '', email: 'john@example.com' },
          jobDescription: { title: 'Software Engineer', description: 'Build amazing software' },
        } as GenerateEmailDto;

        await expect(service.generateEmail(input)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException when candidate name is only whitespace', async () => {
        const input = {
          candidate: { name: '   ', email: 'john@example.com' },
          jobDescription: { title: 'Software Engineer', description: 'Build amazing software' },
        } as GenerateEmailDto;

        await expect(service.generateEmail(input)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException when candidate email is missing', async () => {
        const input = {
          candidate: { name: 'John Doe', email: '' },
          jobDescription: { title: 'Software Engineer', description: 'Build amazing software' },
        } as GenerateEmailDto;

        await expect(service.generateEmail(input)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException when candidate object is missing', async () => {
        const input = {
          candidate: null,
          jobDescription: { title: 'Software Engineer', description: 'Build amazing software' },
        } as unknown as GenerateEmailDto;

        await expect(service.generateEmail(input)).rejects.toThrow(BadRequestException);
      });
    });

    describe('job description validation', () => {
      it('should throw BadRequestException when job description is missing', async () => {
        const input = {
          candidate: { name: 'John Doe', email: 'john@example.com' },
          jobDescription: { title: '', description: '' },
        } as GenerateEmailDto;

        await expect(service.generateEmail(input)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException when job title is missing', async () => {
        const input = {
          candidate: { name: 'John Doe', email: 'john@example.com' },
          jobDescription: { title: '', description: 'Build amazing software' },
        } as GenerateEmailDto;

        await expect(service.generateEmail(input)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException when job description text is missing', async () => {
        const input = {
          candidate: { name: 'John Doe', email: 'john@example.com' },
          jobDescription: { title: 'Software Engineer', description: '' },
        } as GenerateEmailDto;

        await expect(service.generateEmail(input)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException when jobDescription object is missing', async () => {
        const input = {
          candidate: { name: 'John Doe', email: 'john@example.com' },
          jobDescription: null,
        } as unknown as GenerateEmailDto;

        await expect(service.generateEmail(input)).rejects.toThrow(BadRequestException);
      });
    });

    describe('edge cases', () => {
      it('should handle special characters in candidate name', async () => {
        const input: GenerateEmailDto = {
          candidate: { name: "John O'Brien-Smith", email: 'john@example.com' },
          jobDescription: { title: 'Software Engineer', description: 'Build amazing software' },
        };

        const result = await service.generateEmail(input);

        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('subject');
      });

      it('should handle unicode characters in job description', async () => {
        const input: GenerateEmailDto = {
          candidate: { name: 'John Doe', email: 'john@example.com' },
          jobDescription: { title: 'Développeur Senior', description: 'Créer des logiciels incroyables' },
        };

        const result = await service.generateEmail(input);

        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('subject');
      });

      it('should handle very long job descriptions', async () => {
        const longDescription = 'A'.repeat(5000);
        const input: GenerateEmailDto = {
          candidate: { name: 'John Doe', email: 'john@example.com' },
          jobDescription: { title: 'Software Engineer', description: longDescription },
        };

        const result = await service.generateEmail(input);

        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('subject');
      });
    });
  });
});
