/**
 * E2E tests for Users API - Update and Delete endpoints
 * Tests PATCH /users/:id and DELETE /users/:id endpoints
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Users API (e2e)', () => {
  let app: INestApplication;
  let createdUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Create a test user before running update/delete tests
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
      });
    
    createdUserId = response.body.id;
  });

  describe('PATCH /users/:id', () => {
    it('should update user name', () => {
      return request(app.getHttpServer())
        .patch(`/users/${createdUserId}`)
        .send({ name: 'Updated Name' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Name');
          expect(res.body.id).toBe(createdUserId);
        });
    });

    it('should update user email', () => {
      const newEmail = `updated-${Date.now()}@example.com`;
      return request(app.getHttpServer())
        .patch(`/users/${createdUserId}`)
        .send({ email: newEmail })
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(newEmail);
          expect(res.body.id).toBe(createdUserId);
        });
    });

    it('should update multiple fields at once', () => {
      const newEmail = `multi-update-${Date.now()}@example.com`;
      return request(app.getHttpServer())
        .patch(`/users/${createdUserId}`)
        .send({ name: 'Multi Update', email: newEmail })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Multi Update');
          expect(res.body.email).toBe(newEmail);
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .patch('/users/99999')
        .send({ name: 'Test' })
        .expect(404);
    });

    it('should return validation error for invalid email', () => {
      return request(app.getHttpServer())
        .patch(`/users/${createdUserId}`)
        .send({ email: 'invalid-email' })
        .expect(400);
    });

    it('should return validation error for empty name', () => {
      return request(app.getHttpServer())
        .patch(`/users/${createdUserId}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should return 400 for invalid user id format', () => {
      return request(app.getHttpServer())
        .patch('/users/invalid-id')
        .send({ name: 'Test' })
        .expect(400);
    });

    it('should ignore unknown fields in update payload', () => {
      return request(app.getHttpServer())
        .patch(`/users/${createdUserId}`)
        .send({ name: 'Valid Name', unknownField: 'should be ignored' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Valid Name');
          expect(res.body.unknownField).toBeUndefined();
        });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user successfully', async () => {
      // First verify the user exists
      await request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(200);

      // Delete the user
      await request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .expect(204);

      // Verify the user no longer exists
      return request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .delete('/users/99999')
        .expect(404);
    });

    it('should return 400 for invalid user id format', () => {
      return request(app.getHttpServer())
        .delete('/users/invalid-id')
        .expect(400);
    });

    it('should return 404 when trying to delete already deleted user', async () => {
      // Delete the user first
      await request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .expect(204);

      // Try to delete again
      return request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .expect(404);
    });
  });
});
