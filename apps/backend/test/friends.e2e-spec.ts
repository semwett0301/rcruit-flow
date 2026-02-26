import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * E2E tests for Friends API endpoints
 * Tests friend request functionality including new fields:
 * - sender_gamer_tag and sender_profile_picture for pending requests
 * - receiver_gamer_tag and receiver_profile_picture for sent requests
 */
describe('Friends API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let secondUserToken: string;
  let thirdUserToken: string;

  // Test user data
  const testUser = {
    email: 'testuser@example.com',
    password: 'TestPassword123!',
    gamer_tag: 'TestGamer',
  };

  const secondUser = {
    email: 'seconduser@example.com',
    password: 'TestPassword123!',
    gamer_tag: 'SecondGamer',
    profile_picture: 'https://example.com/avatar.png',
  };

  const thirdUser = {
    email: 'thirduser@example.com',
    password: 'TestPassword123!',
    gamer_tag: 'ThirdGamer',
    // No profile picture - tests null handling
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Setup: Create test users and get auth tokens
    // Note: Adjust these endpoints based on your actual auth implementation
    await setupTestUsers();
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * Helper function to setup test users
   * Creates users and obtains authentication tokens
   */
  async function setupTestUsers(): Promise<void> {
    // Register and login first user
    try {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);
    } catch (e) {
      // User may already exist
    }

    const loginResponse1 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    authToken = loginResponse1.body.access_token;

    // Register and login second user (with profile picture)
    try {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(secondUser);
    } catch (e) {
      // User may already exist
    }

    const loginResponse2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: secondUser.email, password: secondUser.password });
    secondUserToken = loginResponse2.body.access_token;

    // Register and login third user (without profile picture)
    try {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(thirdUser);
    } catch (e) {
      // User may already exist
    }

    const loginResponse3 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: thirdUser.email, password: thirdUser.password });
    thirdUserToken = loginResponse3.body.access_token;
  }

  describe('GET /friends/requests/pending', () => {
    beforeEach(async () => {
      // Second user sends friend request to first user
      await request(app.getHttpServer())
        .post('/friends/requests')
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({ receiver_email: testUser.email });

      // Third user sends friend request to first user
      await request(app.getHttpServer())
        .post('/friends/requests')
        .set('Authorization', `Bearer ${thirdUserToken}`)
        .send({ receiver_email: testUser.email });
    });

    it('should return pending requests with sender_gamer_tag field', async () => {
      const response = await request(app.getHttpServer())
        .get('/friends/requests/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      // Verify each pending request has sender_gamer_tag
      response.body.forEach((friendRequest: any) => {
        expect(friendRequest).toHaveProperty('sender_gamer_tag');
        expect(typeof friendRequest.sender_gamer_tag).toBe('string');
        expect(friendRequest.sender_gamer_tag.length).toBeGreaterThan(0);
      });
    });

    it('should return pending requests with sender_profile_picture field', async () => {
      const response = await request(app.getHttpServer())
        .get('/friends/requests/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      // Verify each pending request has sender_profile_picture property
      response.body.forEach((friendRequest: any) => {
        expect(friendRequest).toHaveProperty('sender_profile_picture');
      });
    });

    it('should return correct sender_gamer_tag for each request', async () => {
      const response = await request(app.getHttpServer())
        .get('/friends/requests/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Find request from second user
      const requestFromSecondUser = response.body.find(
        (req: any) => req.sender_gamer_tag === secondUser.gamer_tag,
      );
      expect(requestFromSecondUser).toBeDefined();
      expect(requestFromSecondUser.sender_gamer_tag).toBe(secondUser.gamer_tag);

      // Find request from third user
      const requestFromThirdUser = response.body.find(
        (req: any) => req.sender_gamer_tag === thirdUser.gamer_tag,
      );
      expect(requestFromThirdUser).toBeDefined();
      expect(requestFromThirdUser.sender_gamer_tag).toBe(thirdUser.gamer_tag);
    });

    it('should handle sender with profile picture correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/friends/requests/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Find request from second user (has profile picture)
      const requestFromSecondUser = response.body.find(
        (req: any) => req.sender_gamer_tag === secondUser.gamer_tag,
      );
      expect(requestFromSecondUser).toBeDefined();
      expect(requestFromSecondUser.sender_profile_picture).toBe(
        secondUser.profile_picture,
      );
    });

    it('should handle null sender_profile_picture correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/friends/requests/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Find request from third user (no profile picture)
      const requestFromThirdUser = response.body.find(
        (req: any) => req.sender_gamer_tag === thirdUser.gamer_tag,
      );
      expect(requestFromThirdUser).toBeDefined();
      expect(requestFromThirdUser.sender_profile_picture).toBeNull();
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .get('/friends/requests/pending')
        .expect(401);
    });
  });

  describe('GET /friends/requests/sent', () => {
    beforeEach(async () => {
      // First user sends friend request to second user
      await request(app.getHttpServer())
        .post('/friends/requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ receiver_email: secondUser.email });

      // First user sends friend request to third user
      await request(app.getHttpServer())
        .post('/friends/requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ receiver_email: thirdUser.email });
    });

    it('should return sent requests with receiver_gamer_tag field', async () => {
      const response = await request(app.getHttpServer())
        .get('/friends/requests/sent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      // Verify each sent request has receiver_gamer_tag
      response.body.forEach((friendRequest: any) => {
        expect(friendRequest).toHaveProperty('receiver_gamer_tag');
        expect(typeof friendRequest.receiver_gamer_tag).toBe('string');
        expect(friendRequest.receiver_gamer_tag.length).toBeGreaterThan(0);
      });
    });

    it('should return sent requests with receiver_profile_picture field', async () => {
      const response = await request(app.getHttpServer())
        .get('/friends/requests/sent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      // Verify each sent request has receiver_profile_picture property
      response.body.forEach((friendRequest: any) => {
        expect(friendRequest).toHaveProperty('receiver_profile_picture');
      });
    });

    it('should return correct receiver_gamer_tag for each request', async () => {
      const response = await request(app.getHttpServer())
        .get('/friends/requests/sent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Find request to second user
      const requestToSecondUser = response.body.find(
        (req: any) => req.receiver_gamer_tag === secondUser.gamer_tag,
      );
      expect(requestToSecondUser).toBeDefined();
      expect(requestToSecondUser.receiver_gamer_tag).toBe(secondUser.gamer_tag);

      // Find request to third user
      const requestToThirdUser = response.body.find(
        (req: any) => req.receiver_gamer_tag === thirdUser.gamer_tag,
      );
      expect(requestToThirdUser).toBeDefined();
      expect(requestToThirdUser.receiver_gamer_tag).toBe(thirdUser.gamer_tag);
    });

    it('should handle receiver with profile picture correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/friends/requests/sent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Find request to second user (has profile picture)
      const requestToSecondUser = response.body.find(
        (req: any) => req.receiver_gamer_tag === secondUser.gamer_tag,
      );
      expect(requestToSecondUser).toBeDefined();
      expect(requestToSecondUser.receiver_profile_picture).toBe(
        secondUser.profile_picture,
      );
    });

    it('should handle null receiver_profile_picture correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/friends/requests/sent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Find request to third user (no profile picture)
      const requestToThirdUser = response.body.find(
        (req: any) => req.receiver_gamer_tag === thirdUser.gamer_tag,
      );
      expect(requestToThirdUser).toBeDefined();
      expect(requestToThirdUser.receiver_profile_picture).toBeNull();
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .get('/friends/requests/sent')
        .expect(401);
    });
  });

  describe('Friend request response structure validation', () => {
    it('should include all expected fields in pending request response', async () => {
      // Setup: have second user send a request
      await request(app.getHttpServer())
        .post('/friends/requests')
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({ receiver_email: testUser.email });

      const response = await request(app.getHttpServer())
        .get('/friends/requests/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.length > 0) {
        const friendRequest = response.body[0];
        
        // Verify new fields are present
        expect(friendRequest).toHaveProperty('sender_gamer_tag');
        expect(friendRequest).toHaveProperty('sender_profile_picture');
        
        // Verify sender_gamer_tag is a non-empty string
        expect(typeof friendRequest.sender_gamer_tag).toBe('string');
        
        // Verify sender_profile_picture is either string or null
        expect(
          typeof friendRequest.sender_profile_picture === 'string' ||
          friendRequest.sender_profile_picture === null,
        ).toBe(true);
      }
    });

    it('should include all expected fields in sent request response', async () => {
      // Setup: send a request to second user
      await request(app.getHttpServer())
        .post('/friends/requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ receiver_email: secondUser.email });

      const response = await request(app.getHttpServer())
        .get('/friends/requests/sent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.length > 0) {
        const friendRequest = response.body[0];
        
        // Verify new fields are present
        expect(friendRequest).toHaveProperty('receiver_gamer_tag');
        expect(friendRequest).toHaveProperty('receiver_profile_picture');
        
        // Verify receiver_gamer_tag is a non-empty string
        expect(typeof friendRequest.receiver_gamer_tag).toBe('string');
        
        // Verify receiver_profile_picture is either string or null
        expect(
          typeof friendRequest.receiver_profile_picture === 'string' ||
          friendRequest.receiver_profile_picture === null,
        ).toBe(true);
      }
    });
  });
});
