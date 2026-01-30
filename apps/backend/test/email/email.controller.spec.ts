/**
 * Integration tests for EmailController validation
 *
 * These tests verify that the email controller properly validates
 * incoming requests using NestJS ValidationPipe.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { EmailController } from '../../src/email/email.controller';
import { EmailService } from '../../src/email/email.service';

describe('EmailController (e2e)', () => {
  let app: INestApplication;
  const mockEmailService = { generateEmail: jest.fn() };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [{ provide: EmailService, useValue: mockEmailService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('POST /email/generate - Validation', () => {
    describe('Missing required fields', () => {
      it('should return 400 when candidate data is missing', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({ jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' } })
          .expect(400);
      });

      it('should return 400 when job description is missing', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({ candidate: { name: 'John', email: 'john@example.com' } })
          .expect(400);
      });

      it('should return 400 when request body is empty', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({})
          .expect(400);
      });

      it('should return 400 when candidate name is missing', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { email: 'john@example.com' },
            jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
          })
          .expect(400);
      });

      it('should return 400 when candidate email is missing', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { name: 'John' },
            jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
          })
          .expect(400);
      });

      it('should return 400 when job title is missing', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { name: 'John', email: 'john@example.com' },
            jobDescription: { company: 'Corp', description: 'Work' },
          })
          .expect(400);
      });

      it('should return 400 when job company is missing', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { name: 'John', email: 'john@example.com' },
            jobDescription: { title: 'Dev', description: 'Work' },
          })
          .expect(400);
      });

      it('should return 400 when job description text is missing', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { name: 'John', email: 'john@example.com' },
            jobDescription: { title: 'Dev', company: 'Corp' },
          })
          .expect(400);
      });
    });

    describe('Invalid field formats', () => {
      it('should return 400 when candidate email is invalid', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { name: 'John', email: 'invalid' },
            jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
          })
          .expect(400);
      });

      it('should return 400 when candidate email has invalid format', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { name: 'John', email: 'invalid@' },
            jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
          })
          .expect(400);
      });

      it('should return 400 when candidate email is missing domain', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { name: 'John', email: '@example.com' },
            jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
          })
          .expect(400);
      });
    });

    describe('Successful validation', () => {
      it('should return 200 when all required fields are present', () => {
        mockEmailService.generateEmail.mockResolvedValue({ success: true });
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { name: 'John', email: 'john@example.com' },
            jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
          })
          .expect(200);
      });

      it('should return 200 with valid email containing subdomain', () => {
        mockEmailService.generateEmail.mockResolvedValue({ success: true });
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { name: 'John Doe', email: 'john.doe@mail.example.com' },
            jobDescription: { title: 'Software Developer', company: 'Tech Corp', description: 'Build software' },
          })
          .expect(200);
      });

      it('should call emailService.generateEmail with correct parameters', async () => {
        const requestBody = {
          candidate: { name: 'John', email: 'john@example.com' },
          jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
        };
        mockEmailService.generateEmail.mockResolvedValue({ success: true });

        await request(app.getHttpServer())
          .post('/email/generate')
          .send(requestBody)
          .expect(200);

        expect(mockEmailService.generateEmail).toHaveBeenCalledTimes(1);
      });

      it('should strip unknown properties from request body', () => {
        mockEmailService.generateEmail.mockResolvedValue({ success: true });
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidate: { name: 'John', email: 'john@example.com', unknownField: 'value' },
            jobDescription: { title: 'Dev', company: 'Corp', description: 'Work' },
            extraField: 'should be stripped',
          })
          .expect(200);
      });
    });
  });
});
