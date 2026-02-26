import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Interface representing a pending friend request with sender profile data
 */
export interface PendingFriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: Date;
  sender_gamer_tag: string | null;
  sender_profile_picture: string | null;
}

/**
 * Interface representing a sent friend request with receiver profile data
 */
export interface SentFriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: Date;
  receiver_gamer_tag: string | null;
  receiver_profile_picture: string | null;
}

/**
 * Service handling friend-related operations including friend requests
 */
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository('FriendRequest')
    private readonly friendRequestRepository: Repository<any>,
  ) {}

  /**
   * Retrieves all pending friend requests for a given user with sender profile data
   * 
   * @param userId - The ID of the user to fetch pending requests for
   * @returns Array of pending friend requests with sender's gamer tag and profile picture
   */
  async getPendingRequests(userId: string): Promise<PendingFriendRequest[]> {
    const pendingRequests = await this.friendRequestRepository
      .createQueryBuilder('friend_request')
      .leftJoin('users', 'user', 'user.id = friend_request.sender_id')
      .leftJoin('profiles', 'profile', 'profile.user_id = friend_request.sender_id')
      .select([
        'friend_request.id AS id',
        'friend_request.sender_id AS sender_id',
        'friend_request.receiver_id AS receiver_id',
        'friend_request.status AS status',
        'friend_request.created_at AS created_at',
        'COALESCE(profile.gamer_tag, user.username) AS sender_gamer_tag',
        'profile.profile_picture AS sender_profile_picture',
      ])
      .where('friend_request.receiver_id = :userId', { userId })
      .andWhere('friend_request.status = :status', { status: 'pending' })
      .getRawMany();

    // Map results to ensure proper typing and handle null values gracefully
    return pendingRequests.map((request) => ({
      id: request.id,
      sender_id: request.sender_id,
      receiver_id: request.receiver_id,
      status: request.status,
      created_at: request.created_at,
      sender_gamer_tag: request.sender_gamer_tag || null,
      sender_profile_picture: request.sender_profile_picture || null,
    }));
  }

  /**
   * Retrieves all sent friend requests for a given user with receiver profile data
   * 
   * @param userId - The ID of the user to fetch sent requests for
   * @returns Array of sent friend requests with receiver's gamer tag and profile picture
   */
  async getSentRequests(userId: string): Promise<SentFriendRequest[]> {
    const sentRequests = await this.friendRequestRepository
      .createQueryBuilder('friend_request')
      .leftJoin('users', 'user', 'user.id = friend_request.receiver_id')
      .leftJoin('profiles', 'profile', 'profile.user_id = friend_request.receiver_id')
      .select([
        'friend_request.id AS id',
        'friend_request.sender_id AS sender_id',
        'friend_request.receiver_id AS receiver_id',
        'friend_request.status AS status',
        'friend_request.created_at AS created_at',
        'COALESCE(profile.gamer_tag, user.username) AS receiver_gamer_tag',
        'profile.profile_picture AS receiver_profile_picture',
      ])
      .where('friend_request.sender_id = :userId', { userId })
      .andWhere('friend_request.status = :status', { status: 'pending' })
      .getRawMany();

    // Map results to ensure proper typing and handle null values gracefully
    return sentRequests.map((request) => ({
      id: request.id,
      sender_id: request.sender_id,
      receiver_id: request.receiver_id,
      status: request.status,
      created_at: request.created_at,
      receiver_gamer_tag: request.receiver_gamer_tag || null,
      receiver_profile_picture: request.receiver_profile_picture || null,
    }));
  }
}
