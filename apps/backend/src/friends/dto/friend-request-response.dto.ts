import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for pending friend requests (requests received by the user)
 */
export class PendingFriendRequestResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the friend request',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  request_id: string;

  @ApiProperty({
    description: 'Unique identifier of the user who sent the request',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  sender_id: string;

  @ApiProperty({
    description: 'Gamer tag of the user who sent the request',
    type: String,
    example: 'ProGamer123',
  })
  sender_gamer_tag: string;

  @ApiProperty({
    description: 'Profile picture URL of the sender',
    type: String,
    nullable: true,
    example: 'https://example.com/avatars/user123.png',
  })
  sender_profile_picture: string | null;

  @ApiProperty({
    description: 'Timestamp when the friend request was sent',
    type: Date,
    example: '2024-01-15T10:30:00.000Z',
  })
  sent_at: Date;
}

/**
 * Response DTO for sent friend requests (requests sent by the user)
 */
export class SentFriendRequestResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the friend request',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  request_id: string;

  @ApiProperty({
    description: 'Unique identifier of the user who will receive the request',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  receiver_id: string;

  @ApiProperty({
    description: 'Gamer tag of the user who will receive the request',
    type: String,
    example: 'CoolPlayer456',
  })
  receiver_gamer_tag: string;

  @ApiProperty({
    description: 'Profile picture URL of the receiver',
    type: String,
    nullable: true,
    example: 'https://example.com/avatars/user456.png',
  })
  receiver_profile_picture: string | null;

  @ApiProperty({
    description: 'Timestamp when the friend request was sent',
    type: Date,
    example: '2024-01-15T10:30:00.000Z',
  })
  sent_at: Date;
}
