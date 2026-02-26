/**
 * Unit tests for PusherService signature generation
 * Tests authentication for private and presence channels,
 * as well as MD5 body hash computation for Pusher API requests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PusherService } from '../../src/pusher/pusher.service';
import * as crypto from 'crypto';

describe('PusherService', () => {
  let service: PusherService;
  const mockAppKey = 'test_app_key';
  const mockAppSecret = 'test_app_secret';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PusherService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                PUSHER_APP_ID: 'test_app_id',
                PUSHER_APP_KEY: mockAppKey,
                PUSHER_APP_SECRET: mockAppSecret,
                PUSHER_CLUSTER: 'us2',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PusherService>(PusherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticatePrivateChannel', () => {
    it('should generate correct signature for private-user channel', () => {
      const socketId = '123456.789012';
      const channelName = 'private-user-user123';

      const result = service.authenticatePrivateChannel(socketId, channelName);

      // Verify signature format: app_key followed by colon and 64-char hex signature
      expect(result.auth).toMatch(/^test_app_key:[a-f0-9]{64}$/);

      // Verify signature is computed correctly using HMAC-SHA256
      const stringToSign = `${socketId}:${channelName}`;
      const expectedSignature = crypto
        .createHmac('sha256', mockAppSecret)
        .update(stringToSign)
        .digest('hex');

      expect(result.auth).toBe(`${mockAppKey}:${expectedSignature}`);
    });

    it('should generate correct signature for different socket IDs', () => {
      const socketId = '999999.111111';
      const channelName = 'private-test-channel';

      const result = service.authenticatePrivateChannel(socketId, channelName);

      const stringToSign = `${socketId}:${channelName}`;
      const expectedSignature = crypto
        .createHmac('sha256', mockAppSecret)
        .update(stringToSign)
        .digest('hex');

      expect(result.auth).toBe(`${mockAppKey}:${expectedSignature}`);
    });

    it('should generate correct signature for UUID-based channel names', () => {
      const socketId = '123456.7890123';
      const channelName = 'private-user-48873148-efcc-4c01-b8a8-56b55f1143e3';

      const result = service.authenticatePrivateChannel(socketId, channelName);

      const stringToSign = `${socketId}:${channelName}`;
      const expectedSignature = crypto
        .createHmac('sha256', mockAppSecret)
        .update(stringToSign)
        .digest('hex');

      expect(result.auth).toBe(`${mockAppKey}:${expectedSignature}`);
    });

    it('should throw error when socketId is missing', () => {
      expect(() => {
        service.authenticatePrivateChannel('', 'private-user-123');
      }).toThrow('socketId and channelName are required');
    });

    it('should throw error when channelName is missing', () => {
      expect(() => {
        service.authenticatePrivateChannel('123.456', '');
      }).toThrow('socketId and channelName are required');
    });

    it('should throw error when both socketId and channelName are missing', () => {
      expect(() => {
        service.authenticatePrivateChannel('', '');
      }).toThrow('socketId and channelName are required');
    });

    it('should produce different signatures for different channels', () => {
      const socketId = '123456.789012';
      const channelName1 = 'private-channel-1';
      const channelName2 = 'private-channel-2';

      const result1 = service.authenticatePrivateChannel(socketId, channelName1);
      const result2 = service.authenticatePrivateChannel(socketId, channelName2);

      expect(result1.auth).not.toBe(result2.auth);
    });

    it('should produce different signatures for different socket IDs on same channel', () => {
      const socketId1 = '123456.789012';
      const socketId2 = '654321.210987';
      const channelName = 'private-test-channel';

      const result1 = service.authenticatePrivateChannel(socketId1, channelName);
      const result2 = service.authenticatePrivateChannel(socketId2, channelName);

      expect(result1.auth).not.toBe(result2.auth);
    });
  });

  describe('authenticatePresenceChannel', () => {
    it('should generate correct signature with channel_data', () => {
      const socketId = '123456.789012';
      const channelName = 'presence-party-party123';
      const userId = 'user123';
      const userInfo = { email: 'test@example.com' };

      const result = service.authenticatePresenceChannel(
        socketId,
        channelName,
        userId,
        userInfo,
      );

      // Verify auth format: app_key followed by colon and 64-char hex signature
      expect(result.auth).toMatch(/^test_app_key:[a-f0-9]{64}$/);

      // Verify channel_data is present and valid JSON
      expect(result.channel_data).toBeDefined();
      const channelData = JSON.parse(result.channel_data!);
      expect(channelData.user_id).toBe(userId);
      expect(channelData.user_info).toEqual(userInfo);
    });

    it('should generate correct signature including channel_data in signature', () => {
      const socketId = '123456.789012';
      const channelName = 'presence-room-abc';
      const userId = 'user456';
      const userInfo = { name: 'Test User', role: 'admin' };

      const result = service.authenticatePresenceChannel(
        socketId,
        channelName,
        userId,
        userInfo,
      );

      // Verify the signature is computed with channel_data included
      const channelDataString = JSON.stringify({
        user_id: userId,
        user_info: userInfo,
      });
      const stringToSign = `${socketId}:${channelName}:${channelDataString}`;
      const expectedSignature = crypto
        .createHmac('sha256', mockAppSecret)
        .update(stringToSign)
        .digest('hex');

      expect(result.auth).toBe(`${mockAppKey}:${expectedSignature}`);
      expect(result.channel_data).toBe(channelDataString);
    });

    it('should handle empty userInfo object', () => {
      const socketId = '123456.789012';
      const channelName = 'presence-test';
      const userId = 'user789';
      const userInfo = {};

      const result = service.authenticatePresenceChannel(
        socketId,
        channelName,
        userId,
        userInfo,
      );

      expect(result.auth).toMatch(/^test_app_key:[a-f0-9]{64}$/);
      expect(result.channel_data).toBeDefined();

      const channelData = JSON.parse(result.channel_data!);
      expect(channelData.user_id).toBe(userId);
      expect(channelData.user_info).toEqual({});
    });

    it('should handle complex userInfo with nested objects', () => {
      const socketId = '123456.789012';
      const channelName = 'presence-complex';
      const userId = 'user999';
      const userInfo = {
        profile: {
          name: 'Complex User',
          settings: { theme: 'dark' },
        },
        permissions: ['read', 'write'],
      };

      const result = service.authenticatePresenceChannel(
        socketId,
        channelName,
        userId,
        userInfo,
      );

      expect(result.channel_data).toBeDefined();
      const channelData = JSON.parse(result.channel_data!);
      expect(channelData.user_info).toEqual(userInfo);
    });

    it('should produce different signatures for different users on same channel', () => {
      const socketId = '123456.789012';
      const channelName = 'presence-room';
      const userInfo = { name: 'Test' };

      const result1 = service.authenticatePresenceChannel(
        socketId,
        channelName,
        'user1',
        userInfo,
      );
      const result2 = service.authenticatePresenceChannel(
        socketId,
        channelName,
        'user2',
        userInfo,
      );

      expect(result1.auth).not.toBe(result2.auth);
    });
  });

  describe('computeBodyMd5', () => {
    it('should compute correct MD5 hash for JSON body', () => {
      const body = JSON.stringify({ test: 'data' });
      const result = service.computeBodyMd5(body);

      const expected = crypto.createHash('md5').update(body).digest('hex');
      expect(result).toBe(expected);
    });

    it('should compute correct MD5 hash for empty string', () => {
      const body = '';
      const result = service.computeBodyMd5(body);

      const expected = crypto.createHash('md5').update(body).digest('hex');
      expect(result).toBe(expected);
      // MD5 of empty string is a known value
      expect(result).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });

    it('should compute correct MD5 hash for complex JSON', () => {
      const body = JSON.stringify({
        name: 'test-event',
        data: { message: 'Hello, World!', timestamp: 1234567890 },
        channels: ['channel1', 'channel2'],
      });
      const result = service.computeBodyMd5(body);

      const expected = crypto.createHash('md5').update(body).digest('hex');
      expect(result).toBe(expected);
    });

    it('should return 32-character hex string', () => {
      const body = JSON.stringify({ any: 'content' });
      const result = service.computeBodyMd5(body);

      expect(result).toMatch(/^[a-f0-9]{32}$/);
    });

    it('should produce different hashes for different inputs', () => {
      const body1 = JSON.stringify({ key: 'value1' });
      const body2 = JSON.stringify({ key: 'value2' });

      const result1 = service.computeBodyMd5(body1);
      const result2 = service.computeBodyMd5(body2);

      expect(result1).not.toBe(result2);
    });

    it('should produce same hash for identical inputs', () => {
      const body = JSON.stringify({ consistent: 'data' });

      const result1 = service.computeBodyMd5(body);
      const result2 = service.computeBodyMd5(body);

      expect(result1).toBe(result2);
    });

    it('should handle special characters in body', () => {
      const body = JSON.stringify({ message: 'Hello! @#$%^&*() 日本語' });
      const result = service.computeBodyMd5(body);

      expect(result).toMatch(/^[a-f0-9]{32}$/);
      const expected = crypto.createHash('md5').update(body).digest('hex');
      expect(result).toBe(expected);
    });
  });
});
