/**
 * Unit tests for EmailController validation
 * Tests DTO validation for the email generation endpoint
 */
import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from '../../src/email/email.controller';
import { EmailService } from '../../src/email/email.service';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GenerateEmailDto } from '../../src/email/dto/generate-email.dto';

describe('EmailController', () => {
  let controller: EmailController;
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            generateEmail: jest.fn().mockResolvedValue({ subject: 'Test', body: 'Test body' }),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    service = module.get<EmailService>(EmailService);
  });

  describe('generateEmail validation', () => {
    describe('missing required fields', () => {
      it('should reject when candidate data is missing', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          jobDescription: { title: 'Dev', company: 'Acme', description: 'Build stuff' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'candidate')).toBe(true);
      });

      it('should reject when job description is missing', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John', email: 'john@example.com' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'jobDescription')).toBe(true);
      });

      it('should reject when both candidate and job description are missing', async () => {
        const dto = plainToInstance(GenerateEmailDto, {});
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    describe('candidate validation', () => {
      it('should reject when candidate name is empty', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: '', email: 'john@example.com' },
          jobDescription: { title: 'Dev', company: 'Acme', description: 'Build stuff' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });

      it('should reject when candidate name is only whitespace', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: '   ', email: 'john@example.com' },
          jobDescription: { title: 'Dev', company: 'Acme', description: 'Build stuff' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });

      it('should reject invalid email format', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John', email: 'invalid-email' },
          jobDescription: { title: 'Dev', company: 'Acme', description: 'Build stuff' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });

      it('should reject email without domain', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John', email: 'john@' },
          jobDescription: { title: 'Dev', company: 'Acme', description: 'Build stuff' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });

      it('should reject email without @ symbol', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John', email: 'johnexample.com' },
          jobDescription: { title: 'Dev', company: 'Acme', description: 'Build stuff' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });

      it('should reject when candidate email is missing', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John' },
          jobDescription: { title: 'Dev', company: 'Acme', description: 'Build stuff' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    describe('job description validation', () => {
      it('should reject when job title is empty', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John', email: 'john@example.com' },
          jobDescription: { title: '', company: 'Acme', description: 'Build stuff' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });

      it('should reject when company is empty', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John', email: 'john@example.com' },
          jobDescription: { title: 'Dev', company: '', description: 'Build stuff' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });

      it('should reject when description is empty', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John', email: 'john@example.com' },
          jobDescription: { title: 'Dev', company: 'Acme', description: '' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    describe('valid data', () => {
      it('should accept valid complete data', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John Doe', email: 'john@example.com' },
          jobDescription: { title: 'Developer', company: 'Acme Inc', description: 'Build amazing products' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      });

      it('should accept valid data with special characters in name', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: "John O'Brien-Smith", email: 'john@example.com' },
          jobDescription: { title: 'Developer', company: 'Acme Inc', description: 'Build amazing products' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      });

      it('should accept valid data with subdomain email', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John Doe', email: 'john@mail.example.com' },
          jobDescription: { title: 'Developer', company: 'Acme Inc', description: 'Build amazing products' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      });

      it('should accept valid data with plus sign in email', async () => {
        const dto = plainToInstance(GenerateEmailDto, {
          candidate: { name: 'John Doe', email: 'john+test@example.com' },
          jobDescription: { title: 'Developer', company: 'Acme Inc', description: 'Build amazing products' },
        });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      });
    });
  });

  describe('controller methods', () => {
    it('should call service generateEmail with valid dto', async () => {
      const validDto = {
        candidate: { name: 'John Doe', email: 'john@example.com' },
        jobDescription: { title: 'Developer', company: 'Acme Inc', description: 'Build amazing products' },
      };

      const result = await controller.generateEmail(validDto as GenerateEmailDto);

      expect(service.generateEmail).toHaveBeenCalledWith(validDto);
      expect(result).toEqual({ subject: 'Test', body: 'Test body' });
    });

    it('should return email response from service', async () => {
      const expectedResponse = { subject: 'Custom Subject', body: 'Custom body content' };
      (service.generateEmail as jest.Mock).mockResolvedValue(expectedResponse);

      const validDto = {
        candidate: { name: 'Jane Doe', email: 'jane@example.com' },
        jobDescription: { title: 'Engineer', company: 'Tech Corp', description: 'Engineering role' },
      };

      const result = await controller.generateEmail(validDto as GenerateEmailDto);

      expect(result).toEqual(expectedResponse);
    });
  });
});
