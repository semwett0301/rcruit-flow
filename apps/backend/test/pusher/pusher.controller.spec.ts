/**
 * Unit tests for PusherController
 * Tests Pusher authentication endpoints for private and presence channels
 */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PusherController } from '../../src/pusher/pusher.controller';
import { PusherService } from '../../src/pusher/pusher.service';

describe('PusherController', () => {
  let controller: PusherController;
  let pusherService: PusherService;

  const mockPusherService = {
    authenticateWithSDK: jest.fn(),
    triggerEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PusherController],
      providers: [
        {
          provide: PusherService,
          useValue: mockPusherService,
        },
      ],
    }).compile();

    controller = module.get<PusherController>(PusherController);
    pusherService = module.get<PusherService>(PusherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateChannel', () => {
    const testUserId = '48873148-efcc-4c01-b8a8-56b55f1143e3';
    const mockRequest = {
      user: { id: testUserId },
    } as any;

    it('should authenticate user for their own private channel', () => {
      const body = {
        socket_id: '123456.7890123',
        channel_name: `private-user-${testUserId}`,
      };
      const expectedAuth = { auth: 'test-key:test-signature' };
      mockPusherService.authenticateWithSDK.mockReturnValue(expectedAuth);

      const result = controller.authenticateChannel(body, mockRequest);

      expect(result).toEqual(expectedAuth);
      expect(mockPusherService.authenticateWithSDK).toHaveBeenCalledWith(
        body.socket_id,
        body.channel_name,
      );
    });

    it('should throw BadRequestException for missing socket_id', () => {
      const body = {
        socket_id: '',
        channel_name: `private-user-${testUserId}`,
      };

      expect(() => controller.authenticateChannel(body, mockRequest)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid socket_id format', () => {
      const body = {
        socket_id: 'invalid-socket-id',
        channel_name: `private-user-${testUserId}`,
      };

      expect(() => controller.authenticateChannel(body, mockRequest)).toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException when subscribing to another user channel', () => {
      const body = {
        socket_id: '123456.7890123',
        channel_name: 'private-user-different-user-id',
      };

      expect(() => controller.authenticateChannel(body, mockRequest)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException for missing channel_name', () => {
      const body = {
        socket_id: '123456.7890123',
        channel_name: '',
      };

      expect(() => controller.authenticateChannel(body, mockRequest)).toThrow(
        BadRequestException,
      );
    });

    it('should authenticate generic private channel (non-user specific)', () => {
      const body = {
        socket_id: '123456.7890123',
        channel_name: 'private-general',
      };
      const expectedAuth = { auth: 'test-key:test-signature' };
      mockPusherService.authenticateWithSDK.mockReturnValue(expectedAuth);

      const result = controller.authenticateChannel(body, mockRequest);

      expect(result).toEqual(expectedAuth);
      expect(mockPusherService.authenticateWithSDK).toHaveBeenCalledWith(
        body.socket_id,
        body.channel_name,
      );
    });

    it('should handle socket_id with various valid formats', () => {
      const body = {
        socket_id: '1.1',
        channel_name: `private-user-${testUserId}`,
      };
      const expectedAuth = { auth: 'test-key:test-signature' };
      mockPusherService.authenticateWithSDK.mockReturnValue(expectedAuth);

      const result = controller.authenticateChannel(body, mockRequest);

      expect(result).toEqual(expectedAuth);
    });

    it('should throw BadRequestException for socket_id without dot separator', () => {
      const body = {
        socket_id: '1234567890123',
        channel_name: `private-user-${testUserId}`,
      };

      expect(() => controller.authenticateChannel(body, mockRequest)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('mockEvent', () => {
    it('should trigger event successfully', async () => {
      const body = {
        channel: 'private-user-test',
        event: 'test-event',
        data: { message: 'test' },
      };
      mockPusherService.triggerEvent.mockResolvedValue(undefined);

      const result = await controller.mockEvent(body);

      expect(result).toEqual({ success: true });
      expect(mockPusherService.triggerEvent).toHaveBeenCalledWith(
        body.channel,
        body.event,
        body.data,
      );
    });

    it('should throw BadRequestException for missing channel', async () => {
      const body = {
        channel: '',
        event: 'test-event',
        data: {},
      };

      await expect(controller.mockEvent(body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for missing event', async () => {
      const body = {
        channel: 'private-user-test',
        event: '',
        data: {},
      };

      await expect(controller.mockEvent(body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should trigger event with empty data object', async () => {
      const body = {
        channel: 'private-user-test',
        event: 'test-event',
        data: {},
      };
      mockPusherService.triggerEvent.mockResolvedValue(undefined);

      const result = await controller.mockEvent(body);

      expect(result).toEqual({ success: true });
      expect(mockPusherService.triggerEvent).toHaveBeenCalledWith(
        body.channel,
        body.event,
        body.data,
      );
    });

    it('should trigger event with complex data payload', async () => {
      const body = {
        channel: 'private-user-test',
        event: 'complex-event',
        data: {
          nested: { value: 123 },
          array: [1, 2, 3],
          string: 'test',
        },
      };
      mockPusherService.triggerEvent.mockResolvedValue(undefined);

      const result = await controller.mockEvent(body);

      expect(result).toEqual({ success: true });
      expect(mockPusherService.triggerEvent).toHaveBeenCalledWith(
        body.channel,
        body.event,
        body.data,
      );
    });
  });
});
