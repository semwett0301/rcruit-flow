/**
 * E2E tests for Candidates endpoint
 * Tests candidate email update functionality including validation
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Candidates (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Enable validation pipe to ensure DTO validation works
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('PATCH /candidates/:id', () => {
    describe('email update', () => {
      it('should update candidate email with valid email', async () => {
        const candidateId = 'test-id';
        const newEmail = 'updated@example.com';

        const response = await request(app.getHttpServer())
          .patch(`/candidates/${candidateId}`)
          .send({ email: newEmail })
          .expect(200);

        expect(response.body.email).toBe(newEmail);
      });

      it('should update candidate email with different valid formats', async () => {
        const candidateId = 'test-id';
        const validEmails = [
          'user@domain.com',
          'user.name@domain.com',
          'user+tag@domain.co.uk',
          'user123@subdomain.domain.org',
        ];

        for (const email of validEmails) {
          const response = await request(app.getHttpServer())
            .patch(`/candidates/${candidateId}`)
            .send({ email })
            .expect(200);

          expect(response.body.email).toBe(email);
        }
      });

      it('should reject invalid email format', async () => {
        const candidateId = 'test-id';

        const response = await request(app.getHttpServer())
          .patch(`/candidates/${candidateId}`)
          .send({ email: 'invalid-email' })
          .expect(400);

        expect(response.body.message).toBeDefined();
      });

      it('should reject email without domain', async () => {
        const candidateId = 'test-id';

        await request(app.getHttpServer())
          .patch(`/candidates/${candidateId}`)
          .send({ email: 'user@' })
          .expect(400);
      });

      it('should reject email without @ symbol', async () => {
        const candidateId = 'test-id';

        await request(app.getHttpServer())
          .patch(`/candidates/${candidateId}`)
          .send({ email: 'userdomain.com' })
          .expect(400);
      });

      it('should reject empty email', async () => {
        const candidateId = 'test-id';

        await request(app.getHttpServer())
          .patch(`/candidates/${candidateId}`)
          .send({ email: '' })
          .expect(400);
      });

      it('should reject email with spaces', async () => {
        const candidateId = 'test-id';

        await request(app.getHttpServer())
          .patch(`/candidates/${candidateId}`)
          .send({ email: 'user @domain.com' })
          .expect(400);
      });
    });

    describe('candidate not found', () => {
      it('should return 404 for non-existent candidate', async () => {
        const nonExistentId = 'non-existent-id';

        await request(app.getHttpServer())
          .patch(`/candidates/${nonExistentId}`)
          .send({ email: 'valid@example.com' })
          .expect(404);
      });
    });

    describe('request validation', () => {
      it('should handle empty request body', async () => {
        const candidateId = 'test-id';

        await request(app.getHttpServer())
          .patch(`/candidates/${candidateId}`)
          .send({})
          .expect(400);
      });

      it('should ignore unknown fields when updating email', async () => {
        const candidateId = 'test-id';
        const newEmail = 'updated@example.com';

        const response = await request(app.getHttpServer())
          .patch(`/candidates/${candidateId}`)
          .send({
            email: newEmail,
            unknownField: 'should be ignored',
          })
          .expect(400); // With forbidNonWhitelisted: true, unknown fields cause 400

        expect(response.body.message).toBeDefined();
      });
    });
  });
});
