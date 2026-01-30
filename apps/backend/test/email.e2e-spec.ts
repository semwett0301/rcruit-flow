/**
 * E2E tests for Email Generation Endpoint Validation
 *
 * Tests the /email/generate endpoint for proper validation of:
 * - Required fields (candidateData, jobDescription)
 * - Email format validation
 * - Successful generation with valid data
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { EmailModule } from '../src/email/email.module';

describe('EmailController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EmailModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/email/generate (POST)', () => {
    describe('Missing required fields', () => {
      it('should return 400 when candidate data is missing', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({ jobDescription: 'Test job' })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBeDefined();
            expect(Array.isArray(res.body.message) || typeof res.body.message === 'string').toBe(true);
          });
      });

      it('should return 400 when job description is missing', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({ candidateData: { name: 'John', email: 'john@test.com' } })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBeDefined();
          });
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
            candidateData: { email: 'john@test.com' },
            jobDescription: 'Software Engineer position',
          })
          .expect(400);
      });

      it('should return 400 when candidate email is missing', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidateData: { name: 'John Doe' },
            jobDescription: 'Software Engineer position',
          })
          .expect(400);
      });
    });

    describe('Invalid field formats', () => {
      it('should return 400 for invalid email format', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidateData: { name: 'John', email: 'invalid-email' },
            jobDescription: 'Test job',
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBeDefined();
          });
      });

      it('should return 400 for email without domain', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidateData: { name: 'John', email: 'john@' },
            jobDescription: 'Test job',
          })
          .expect(400);
      });

      it('should return 400 for email without @ symbol', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidateData: { name: 'John', email: 'johntest.com' },
            jobDescription: 'Test job',
          })
          .expect(400);
      });

      it('should return 400 when candidateData is not an object', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidateData: 'invalid-string',
            jobDescription: 'Test job',
          })
          .expect(400);
      });

      it('should return 400 when jobDescription is empty string', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidateData: { name: 'John Doe', email: 'john@test.com' },
            jobDescription: '',
          })
          .expect(400);
      });
    });

    describe('Successful requests', () => {
      it('should return 200 when all required fields are present', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidateData: { name: 'John Doe', email: 'john@test.com' },
            jobDescription: 'Software Engineer position',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toBeDefined();
          });
      });

      it('should return 200 with valid email containing subdomain', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidateData: { name: 'Jane Smith', email: 'jane@mail.company.com' },
            jobDescription: 'Senior Developer role',
          })
          .expect(200);
      });

      it('should return 200 with valid email containing plus sign', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidateData: { name: 'Test User', email: 'test+alias@example.com' },
            jobDescription: 'QA Engineer position',
          })
          .expect(200);
      });

      it('should strip unknown properties from request (whitelist)', () => {
        return request(app.getHttpServer())
          .post('/email/generate')
          .send({
            candidateData: { name: 'John Doe', email: 'john@test.com', unknownField: 'value' },
            jobDescription: 'Software Engineer position',
            extraField: 'should be stripped',
          })
          .expect(200);
      });
    });
  });
});
