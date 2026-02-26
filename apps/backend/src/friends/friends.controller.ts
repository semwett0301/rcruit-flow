import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * DTO for pending friend request item
 */
class PendingFriendRequestDto {
  @ApiProperty({ description: 'Friend request ID' })
  id: string;

  @ApiProperty({ description: 'Sender user ID' })
  sender_id: string;

  @ApiProperty({ description: 'Sender gamer tag' })
  sender_gamer_tag: string;

  @ApiProperty({ description: 'Sender profile picture URL', nullable: true })
  sender_profile_picture: string | null;

  @ApiProperty({ description: 'Request creation timestamp' })
  created_at: Date;
}

/**
 * DTO for sent friend request item
 */
class SentFriendRequestDto {
  @ApiProperty({ description: 'Friend request ID' })
  id: string;

  @ApiProperty({ description: 'Receiver user ID' })
  receiver_id: string;

  @ApiProperty({ description: 'Receiver gamer tag' })
  receiver_gamer_tag: string;

  @ApiProperty({ description: 'Receiver profile picture URL', nullable: true })
  receiver_profile_picture: string | null;

  @ApiProperty({ description: 'Request creation timestamp' })
  created_at: Date;
}

/**
 * Response wrapper for pending friend requests
 */
class PendingFriendRequestsResponseDto {
  @ApiProperty({ description: 'Response status code', example: 200 })
  code: number;

  @ApiProperty({
    description: 'Array of pending friend requests',
    type: [PendingFriendRequestDto],
  })
  data: PendingFriendRequestDto[];

  @ApiProperty({ description: 'Response message', example: 'Pending friend requests retrieved successfully' })
  message: string;
}

/**
 * Response wrapper for sent friend requests
 */
class SentFriendRequestsResponseDto {
  @ApiProperty({ description: 'Response status code', example: 200 })
  code: number;

  @ApiProperty({
    description: 'Array of sent friend requests',
    type: [SentFriendRequestDto],
  })
  data: SentFriendRequestDto[];

  @ApiProperty({ description: 'Response message', example: 'Sent friend requests retrieved successfully' })
  message: string;
}

/**
 * Friends controller handling friend-related endpoints
 */
@ApiTags('friends')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  /**
   * Get all pending friend requests for the authenticated user
   * Returns requests where the user is the receiver
   */
  @Get('requests/pending')
  @ApiOperation({ summary: 'Get pending friend requests' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pending friend requests retrieved successfully',
    type: PendingFriendRequestsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  async getPendingRequests(@Request() req) {
    const userId = req.user.id;
    const pendingRequests = await this.friendsService.getPendingRequests(userId);
    return {
      code: HttpStatus.OK,
      data: pendingRequests,
      message: 'Pending friend requests retrieved successfully',
    };
  }

  /**
   * Get all sent friend requests by the authenticated user
   * Returns requests where the user is the sender
   */
  @Get('requests/sent')
  @ApiOperation({ summary: 'Get sent friend requests' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sent friend requests retrieved successfully',
    type: SentFriendRequestsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  async getSentRequests(@Request() req) {
    const userId = req.user.id;
    const sentRequests = await this.friendsService.getSentRequests(userId);
    return {
      code: HttpStatus.OK,
      data: sentRequests,
      message: 'Sent friend requests retrieved successfully',
    };
  }
}
