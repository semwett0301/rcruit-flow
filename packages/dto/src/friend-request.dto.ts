/**
 * Friend Request DTOs
 * Data Transfer Objects for friend request operations
 */

/**
 * DTO for pending friend requests (requests received by the user)
 * Contains information about the sender of the friend request
 */
export interface PendingFriendRequestDto {
  /** Unique identifier for the friend request */
  request_id: string;
  /** ID of the user who sent the friend request */
  sender_id: string;
  /** Gamer tag of the sender */
  sender_gamer_tag: string;
  /** Profile picture URL of the sender, null if not set */
  sender_profile_picture: string | null;
  /** Timestamp when the request was sent */
  sent_at: string;
}

/**
 * DTO for sent friend requests (requests sent by the user)
 * Contains information about the receiver of the friend request
 */
export interface SentFriendRequestDto {
  /** Unique identifier for the friend request */
  request_id: string;
  /** ID of the user who will receive the friend request */
  receiver_id: string;
  /** Gamer tag of the receiver */
  receiver_gamer_tag: string;
  /** Profile picture URL of the receiver, null if not set */
  receiver_profile_picture: string | null;
  /** Timestamp when the request was sent */
  sent_at: string;
}
