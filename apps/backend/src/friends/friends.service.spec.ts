import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { Friendship } from './entities/friendship.entity';

describe('FriendsService', () => {
  let service: FriendsService;
  let friendRequestRepository: jest.Mocked<Repository<FriendRequest>>;
  let friendshipRepository: jest.Mocked<Repository<Friendship>>;

  // Mock user data with gamer_tag and profile_picture fields
  const mockSenderWithProfile = {
    id: 'sender-123',
    gamer_tag: 'ProGamer99',
    profile_picture: 'https://example.com/avatar1.png',
    email: 'sender@example.com',
  };

  const mockSenderWithNullProfile = {
    id: 'sender-456',
    gamer_tag: 'CasualPlayer',
    profile_picture: null,
    email: 'sender2@example.com',
  };

  const mockReceiverWithProfile = {
    id: 'receiver-123',
    gamer_tag: 'GameMaster42',
    profile_picture: 'https://example.com/avatar2.png',
    email: 'receiver@example.com',
  };

  const mockReceiverWithNullProfile = {
    id: 'receiver-456',
    gamer_tag: 'NewPlayer',
    profile_picture: null,
    email: 'receiver2@example.com',
  };

  // Mock pending friend requests (requests received by current user)
  const mockPendingRequests = [
    {
      id: 'request-1',
      sender: mockSenderWithProfile,
      receiver: mockReceiverWithProfile,
      status: 'pending',
      createdAt: new Date('2024-01-15'),
      sender_gamer_tag: mockSenderWithProfile.gamer_tag,
      sender_profile_picture: mockSenderWithProfile.profile_picture,
    },
    {
      id: 'request-2',
      sender: mockSenderWithNullProfile,
      receiver: mockReceiverWithProfile,
      status: 'pending',
      createdAt: new Date('2024-01-16'),
      sender_gamer_tag: mockSenderWithNullProfile.gamer_tag,
      sender_profile_picture: mockSenderWithNullProfile.profile_picture,
    },
  ];

  // Mock sent friend requests (requests sent by current user)
  const mockSentRequests = [
    {
      id: 'request-3',
      sender: mockSenderWithProfile,
      receiver: mockReceiverWithProfile,
      status: 'pending',
      createdAt: new Date('2024-01-17'),
      receiver_gamer_tag: mockReceiverWithProfile.gamer_tag,
      receiver_profile_picture: mockReceiverWithProfile.profile_picture,
    },
    {
      id: 'request-4',
      sender: mockSenderWithProfile,
      receiver: mockReceiverWithNullProfile,
      status: 'pending',
      createdAt: new Date('2024-01-18'),
      receiver_gamer_tag: mockReceiverWithNullProfile.gamer_tag,
      receiver_profile_picture: mockReceiverWithNullProfile.profile_picture,
    },
  ];

  beforeEach(async () => {
    const mockFriendRequestRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockFriendshipRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        {
          provide: getRepositoryToken(FriendRequest),
          useValue: mockFriendRequestRepository,
        },
        {
          provide: getRepositoryToken(Friendship),
          useValue: mockFriendshipRepository,
        },
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
    friendRequestRepository = module.get(getRepositoryToken(FriendRequest));
    friendshipRepository = module.get(getRepositoryToken(Friendship));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPendingRequests', () => {
    it('should return pending requests with sender_gamer_tag and sender_profile_picture', async () => {
      friendRequestRepository.find.mockResolvedValue(mockPendingRequests as any);

      const result = await service.getPendingRequests(mockReceiverWithProfile.id);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);

      // Verify first request has sender fields
      expect(result[0]).toHaveProperty('sender_gamer_tag');
      expect(result[0]).toHaveProperty('sender_profile_picture');
      expect(result[0].sender_gamer_tag).toBe('ProGamer99');
      expect(result[0].sender_profile_picture).toBe('https://example.com/avatar1.png');
    });

    it('should handle sender with null profile_picture', async () => {
      friendRequestRepository.find.mockResolvedValue(mockPendingRequests as any);

      const result = await service.getPendingRequests(mockReceiverWithProfile.id);

      // Verify second request has null profile_picture
      expect(result[1]).toHaveProperty('sender_gamer_tag');
      expect(result[1]).toHaveProperty('sender_profile_picture');
      expect(result[1].sender_gamer_tag).toBe('CasualPlayer');
      expect(result[1].sender_profile_picture).toBeNull();
    });

    it('should return empty array when no pending requests exist', async () => {
      friendRequestRepository.find.mockResolvedValue([]);

      const result = await service.getPendingRequests('user-with-no-requests');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('getSentRequests', () => {
    it('should return sent requests with receiver_gamer_tag and receiver_profile_picture', async () => {
      friendRequestRepository.find.mockResolvedValue(mockSentRequests as any);

      const result = await service.getSentRequests(mockSenderWithProfile.id);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);

      // Verify first request has receiver fields
      expect(result[0]).toHaveProperty('receiver_gamer_tag');
      expect(result[0]).toHaveProperty('receiver_profile_picture');
      expect(result[0].receiver_gamer_tag).toBe('GameMaster42');
      expect(result[0].receiver_profile_picture).toBe('https://example.com/avatar2.png');
    });

    it('should handle receiver with null profile_picture', async () => {
      friendRequestRepository.find.mockResolvedValue(mockSentRequests as any);

      const result = await service.getSentRequests(mockSenderWithProfile.id);

      // Verify second request has null profile_picture
      expect(result[1]).toHaveProperty('receiver_gamer_tag');
      expect(result[1]).toHaveProperty('receiver_profile_picture');
      expect(result[1].receiver_gamer_tag).toBe('NewPlayer');
      expect(result[1].receiver_profile_picture).toBeNull();
    });

    it('should return empty array when no sent requests exist', async () => {
      friendRequestRepository.find.mockResolvedValue([]);

      const result = await service.getSentRequests('user-with-no-sent-requests');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('edge cases for profile fields', () => {
    it('should correctly handle all users having null profile_picture', async () => {
      const requestsWithNullProfiles = [
        {
          id: 'request-null-1',
          sender: mockSenderWithNullProfile,
          receiver: mockReceiverWithNullProfile,
          status: 'pending',
          createdAt: new Date(),
          sender_gamer_tag: mockSenderWithNullProfile.gamer_tag,
          sender_profile_picture: null,
        },
      ];

      friendRequestRepository.find.mockResolvedValue(requestsWithNullProfiles as any);

      const result = await service.getPendingRequests(mockReceiverWithNullProfile.id);

      expect(result[0].sender_gamer_tag).toBe('CasualPlayer');
      expect(result[0].sender_profile_picture).toBeNull();
    });

    it('should correctly handle gamer_tag field in pending requests', async () => {
      friendRequestRepository.find.mockResolvedValue(mockPendingRequests as any);

      const result = await service.getPendingRequests(mockReceiverWithProfile.id);

      // Ensure gamer_tag is always a string
      result.forEach((request) => {
        expect(typeof request.sender_gamer_tag).toBe('string');
        expect(request.sender_gamer_tag.length).toBeGreaterThan(0);
      });
    });

    it('should correctly handle gamer_tag field in sent requests', async () => {
      friendRequestRepository.find.mockResolvedValue(mockSentRequests as any);

      const result = await service.getSentRequests(mockSenderWithProfile.id);

      // Ensure gamer_tag is always a string
      result.forEach((request) => {
        expect(typeof request.receiver_gamer_tag).toBe('string');
        expect(request.receiver_gamer_tag.length).toBeGreaterThan(0);
      });
    });

    it('should handle profile_picture being undefined vs null', async () => {
      const requestWithUndefinedProfile = [
        {
          id: 'request-undefined',
          sender: {
            ...mockSenderWithProfile,
            profile_picture: undefined,
          },
          receiver: mockReceiverWithProfile,
          status: 'pending',
          createdAt: new Date(),
          sender_gamer_tag: mockSenderWithProfile.gamer_tag,
          sender_profile_picture: undefined,
        },
      ];

      friendRequestRepository.find.mockResolvedValue(requestWithUndefinedProfile as any);

      const result = await service.getPendingRequests(mockReceiverWithProfile.id);

      expect(result[0]).toHaveProperty('sender_profile_picture');
      // Should handle undefined gracefully (either as undefined or null)
      expect(result[0].sender_profile_picture === undefined || result[0].sender_profile_picture === null).toBe(true);
    });
  });
});
