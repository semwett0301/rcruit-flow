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
  BadRequestException,
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
   * Pusher authentication endpoint for private channels
   * POST /pusher/auth
   *
   * Body (application/x-www-form-urlencoded or application/json):
   * - socket_id: The socket ID from Pusher client
   * - channel_name: The channel being subscribed to (e.g., private-user-<userId>)
   *
   * Channel types supported:
   * - private-user-<user-id>: User-specific notifications (party invitations, etc.)
   * - presence-party-<party-id>: Party presence channels
   *
   * @param body - The authentication request body containing socket_id and channel_name
   * @param req - The Express request object containing authenticated user
   * @returns PusherAuthResponse with authentication signature
   * @throws BadRequestException if required fields are missing or invalid
   * @throws UnauthorizedException if user is not authorized for the channel
   */
  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  authenticateChannel(
    @Body() body: PusherAuthDto,
    @Req() req: Request,
  ): PusherAuthResponse {
    const { socket_id, channel_name } = body;
    const user = req.user as { id: string; email?: string };

    this.logger.debug(
      `Pusher auth request - socket_id: ${socket_id}, channel: ${channel_name}, user: ${user?.id}`,
    );

    // Validate required fields
    if (!socket_id || !channel_name) {
      this.logger.error('Missing socket_id or channel_name');
      throw new BadRequestException('socket_id and channel_name are required');
    }

    // Validate socket_id format (typically: "123456.7890123")
    if (!/^\d+\.\d+$/.test(socket_id)) {
      this.logger.error(`Invalid socket_id format: ${socket_id}`);
      throw new BadRequestException('Invalid socket_id format');
    }

    // Handle private-user channels
    if (channel_name.startsWith('private-user-')) {
      const channelUserId = channel_name.replace('private-user-', '');

      // Verify user can only subscribe to their own channel
      if (channelUserId !== user.id) {
        this.logger.error(
          `User ${user.id} attempted to subscribe to channel for user ${channelUserId}`,
        );
        throw new UnauthorizedException(
          "Cannot subscribe to another user's channel",
        );
      }

      try {
        const authResponse = this.pusherService.authenticatePrivateChannel(
          socket_id,
          channel_name,
        );
        this.logger.debug(`Auth successful for channel: ${channel_name}`);
        return authResponse;
      } catch (error) {
        this.logger.error(`Pusher auth failed: ${error.message}`, error.stack);
        throw new BadRequestException('Authentication failed');
      }
    }

    // Handle presence channels
    if (channel_name.startsWith('presence-')) {
      try {
        const authResponse = this.pusherService.authenticatePresenceChannel(
          socket_id,
          channel_name,
          user.id,
          { email: user.email },
        );
        this.logger.debug(`Auth successful for presence channel: ${channel_name}`);
        return authResponse;
      } catch (error) {
        this.logger.error(`Pusher auth failed: ${error.message}`, error.stack);
        throw new BadRequestException('Authentication failed');
      }
    }

    // Handle other private channels
    if (channel_name.startsWith('private-')) {
      try {
        const authResponse = this.pusherService.authenticatePrivateChannel(
          socket_id,
          channel_name,
        );
        this.logger.debug(`Auth successful for channel: ${channel_name}`);
        return authResponse;
      } catch (error) {
        this.logger.error(`Pusher auth failed: ${error.message}`, error.stack);
        throw new BadRequestException('Authentication failed');
      }
    }

    this.logger.error(`Invalid channel name: ${channel_name}`);
    throw new UnauthorizedException('Invalid channel name');
  }

  /**
   * Mock event endpoint for testing (development only)
   * POST /pusher/mock-event
   *
   * @param body - The mock event body containing channel, event, and data
   * @returns Success indicator
   * @throws BadRequestException if required fields are missing
   */
  @Post('mock-event')
  @HttpCode(HttpStatus.OK)
  async mockEvent(
    @Body() body: { channel: string; event: string; data: any },
  ): Promise<{ success: boolean }> {
    const { channel, event, data } = body;

    if (!channel || !event) {
      throw new BadRequestException('channel and event are required');
    }

    this.logger.debug(`Mock event - channel: ${channel}, event: ${event}`);
    await this.pusherService.triggerEvent(channel, event, data);
    return { success: true };
  }
}
