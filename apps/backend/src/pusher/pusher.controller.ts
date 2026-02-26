/**
 * Pusher Authentication Controller
 *
 * Handles authentication for Pusher private and presence channels.
 * Ensures users can only subscribe to channels they are authorized to access.
 */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { PusherService, PusherAuthResponse } from './pusher.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

/**
 * DTO for Pusher authentication requests
 */
export interface PusherAuthDto {
  socket_id: string;
  channel_name: string;
}

@Controller('pusher')
export class PusherController {
  private readonly logger = new Logger(PusherController.name);

  constructor(private readonly pusherService: PusherService) {}

  /**
   * Pusher auth endpoint for private and presence channels
   * POST /pusher/auth
   * Body: { socket_id: string, channel_name: string }
   *
   * Channel types supported:
   * - private-user-<user-id>: User-specific notifications (party invitations, etc.)
   * - presence-party-<party-id>: Party presence channels
   *
   * @param body - The authentication request body containing socket_id and channel_name
   * @param req - The Express request object containing authenticated user
   * @returns PusherAuthResponse with authentication signature
   * @throws UnauthorizedException if authentication fails or user is not authorized
   */
  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @Body() body: PusherAuthDto,
    @Req() req: Request,
  ): Promise<PusherAuthResponse> {
    const { socket_id, channel_name } = body;
    const user = req.user as { id: string; email: string };

    this.logger.debug(
      `Pusher auth request - socket_id: ${socket_id}, channel: ${channel_name}, user: ${user?.id}`,
    );

    // Validate required fields
    if (!socket_id || !channel_name) {
      this.logger.error('Missing socket_id or channel_name');
      throw new UnauthorizedException('Missing socket_id or channel_name');
    }

    // Handle private-user channels
    if (channel_name.startsWith('private-user-')) {
      const channelUserId = channel_name.replace('private-user-', '');

      // Verify user can only subscribe to their own channel
      if (channelUserId !== user.id) {
        this.logger.warn(
          `User ${user.id} attempted to subscribe to channel for user ${channelUserId}`,
        );
        throw new UnauthorizedException(
          "Cannot subscribe to another user's channel",
        );
      }

      return this.pusherService.authenticatePrivateChannel(
        socket_id,
        channel_name,
      );
    }

    // Handle presence channels
    if (channel_name.startsWith('presence-')) {
      return this.pusherService.authenticatePresenceChannel(
        socket_id,
        channel_name,
        user.id,
        { email: user.email },
      );
    }

    // Handle other private channels
    if (channel_name.startsWith('private-')) {
      return this.pusherService.authenticatePrivateChannel(
        socket_id,
        channel_name,
      );
    }

    this.logger.error(`Invalid channel name: ${channel_name}`);
    throw new UnauthorizedException('Invalid channel name');
  }
}
