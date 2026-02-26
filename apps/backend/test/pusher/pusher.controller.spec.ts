/**
 * Integration tests for PusherController
 * Tests Pusher authentication endpoints for private and presence channels
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PusherController } from '../../src/pusher/pusher.controller';
import { PusherService } from '../../src/pusher/pusher.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';

describe('PusherController (e2e)', () => {
  let app: INestApplication;
  let pusherService: PusherService;

  const mockUser = { id: 'user123', email: 'test@example.com' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PusherController],
      providers: [
        {
          provide: PusherService,
          useValue: {
            authenticatePrivateChannel: jest.fn().mockReturnValue({
              auth: 'test_key:test_signature',
            }),
            authenticatePresenceChannel: jest.fn().mockReturnValue({
              auth: 'test_key:test_signature',
              channel_data: JSON.stringify({ user_id: 'user123' }),
            }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    pusherService = moduleFixture.get<PusherService>(PusherService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /pusher/auth', () => {
    describe('Private channel authentication', () => {
      it('should authenticate private-user channel for correct user', async () => {
        const response = await request(app.getHttpServer())
          .post('/pusher/auth')
          .send({
            socket_id: '123456.789012',
            channel_name: 'private-user-user123',
          })
          .expect(200);

        expect(response.body.auth).toBeDefined();
        expect(pusherService.authenticatePrivateChannel).toHaveBeenCalledWith(
          '123456.789012',
          'private-user-user123',
        );
      });

      it('should reject subscription to another user channel', async () => {
        await request(app.getHttpServer())
          .post('/pusher/auth')
          .send({
            socket_id: '123456.789012',
            channel_name: 'private-user-otheruser',
          })
          .expect(401);
      });

      it('should authenticate generic private channel', async () => {
        const response = await request(app.getHttpServer())
          .post('/pusher/auth')
          .send({
            socket_id: '123456.789012',
            channel_name: 'private-general',
          })
          .expect(200);

        expect(response.body.auth).toBeDefined();
        expect(pusherService.authenticatePrivateChannel).toHaveBeenCalledWith(
          '123456.789012',
          'private-general',
        );
      });
    });

    describe('Presence channel authentication', () => {
      it('should authenticate presence channel with user data', async () => {
        const response = await request(app.getHttpServer())
          .post('/pusher/auth')
          .send({
            socket_id: '123456.789012',
            channel_name: 'presence-room-abc',
          })
          .expect(200);

        expect(response.body.auth).toBeDefined();
        expect(response.body.channel_data).toBeDefined();
        expect(pusherService.authenticatePresenceChannel).toHaveBeenCalledWith(
          '123456.789012',
          'presence-room-abc',
          expect.objectContaining({ user_id: mockUser.id }),
        );
      });
    });

    describe('Validation errors', () => {
      it('should reject request without socket_id', async () => {
        await request(app.getHttpServer())
          .post('/pusher/auth')
          .send({
            channel_name: 'private-user-user123',
          })
          .expect(401);
      });

      it('should reject request without channel_name', async () => {
        await request(app.getHttpServer())
          .post('/pusher/auth')
          .send({
            socket_id: '123456.789012',
          })
          .expect(401);
      });

      it('should reject request with empty body', async () => {
        await request(app.getHttpServer())
          .post('/pusher/auth')
          .send({})
          .expect(401);
      });

      it('should reject request with invalid socket_id format', async () => {
        await request(app.getHttpServer())
          .post('/pusher/auth')
          .send({
            socket_id: 'invalid',
            channel_name: 'private-user-user123',
          })
          .expect(401);
      });
    });

    describe('Channel name validation', () => {
      it('should reject invalid channel name prefix', async () => {
        await request(app.getHttpServer())
          .post('/pusher/auth')
          .send({
            socket_id: '123456.789012',
            channel_name: 'public-channel',
          })
          .expect(401);
      });

      it('should reject empty channel name', async () => {
        await request(app.getHttpServer())
          .post('/pusher/auth')
          .send({
            socket_id: '123456.789012',
            channel_name: '',
          })
          .expect(401);
      });
    });
  });
});
