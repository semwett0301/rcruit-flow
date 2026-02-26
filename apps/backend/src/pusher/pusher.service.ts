/**
 * Pusher Service
 *
 * Provides Pusher integration with proper HMAC SHA256 signature generation
 * for private and presence channel authentication, webhook validation,
 * and event triggering.
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import Pusher from 'pusher';

/**
 * Response format for Pusher channel authentication
 */
export interface PusherAuthResponse {
  auth: string;
  channel_data?: string;
}

@Injectable()
export class PusherService {
  private pusher: Pusher;
  private readonly appKey: string;
  private readonly appSecret: string;
  private readonly appId: string;
  private readonly cluster: string;

  constructor(private configService: ConfigService) {
    this.appId = this.configService.get<string>('PUSHER_APP_ID');
    this.appKey = this.configService.get<string>('PUSHER_APP_KEY');
    this.appSecret = this.configService.get<string>('PUSHER_APP_SECRET');
    this.cluster = this.configService.get<string>('PUSHER_CLUSTER', 'us2');

    this.pusher = new Pusher({
      appId: this.appId,
      key: this.appKey,
      secret: this.appSecret,
      cluster: this.cluster,
      useTLS: true,
    });
  }

  /**
   * Authenticate a private channel subscription
   *
   * Generates HMAC SHA256 signature for private channel authentication.
   * Signature format: HMAC SHA256 hex digest of <socket_id>:<channel_name>
   *
   * @param socketId - The socket ID from the Pusher connection
   * @param channelName - The name of the private channel (e.g., 'private-user-123')
   * @returns PusherAuthResponse with auth token in format <app_key>:<signature>
   * @throws Error if socketId or channelName is missing
   */
  authenticatePrivateChannel(
    socketId: string,
    channelName: string,
  ): PusherAuthResponse {
    // Validate inputs
    if (!socketId || !channelName) {
      throw new Error('socketId and channelName are required');
    }

    // Construct the string to sign: socket_id:channel_name
    const stringToSign = `${socketId}:${channelName}`;

    // Generate HMAC SHA256 signature
    const signature = crypto
      .createHmac('sha256', this.appSecret)
      .update(stringToSign)
      .digest('hex');

    // Return auth response in Pusher format: <app_key>:<signature>
    return {
      auth: `${this.appKey}:${signature}`,
    };
  }

  /**
   * Authenticate a presence channel subscription
   *
   * Generates HMAC SHA256 signature for presence channel authentication.
   * Includes channel_data with user information.
   *
   * @param socketId - The socket ID from the Pusher connection
   * @param channelName - The name of the presence channel (e.g., 'presence-room-123')
   * @param userId - Unique identifier for the user
   * @param userInfo - Optional additional user information to include
   * @returns PusherAuthResponse with auth token and channel_data
   * @throws Error if required parameters are missing
   */
  authenticatePresenceChannel(
    socketId: string,
    channelName: string,
    userId: string,
    userInfo?: Record<string, any>,
  ): PusherAuthResponse {
    // Validate inputs
    if (!socketId || !channelName || !userId) {
      throw new Error('socketId, channelName, and userId are required');
    }

    // Construct channel data with user information
    const channelData = JSON.stringify({
      user_id: userId,
      user_info: userInfo || {},
    });

    // Construct the string to sign: socket_id:channel_name:channel_data
    const stringToSign = `${socketId}:${channelName}:${channelData}`;

    // Generate HMAC SHA256 signature
    const signature = crypto
      .createHmac('sha256', this.appSecret)
      .update(stringToSign)
      .digest('hex');

    return {
      auth: `${this.appKey}:${signature}`,
      channel_data: channelData,
    };
  }

  /**
   * Trigger an event on a channel
   *
   * @param channel - The channel name to trigger the event on
   * @param event - The event name
   * @param data - The data payload to send with the event
   */
  async trigger(channel: string, event: string, data: any): Promise<void> {
    await this.pusher.trigger(channel, event, data);
  }

  /**
   * Trigger an event on multiple channels
   *
   * @param channels - Array of channel names (max 100)
   * @param event - The event name
   * @param data - The data payload to send with the event
   */
  async triggerBatch(
    channels: string[],
    event: string,
    data: any,
  ): Promise<void> {
    await this.pusher.trigger(channels, event, data);
  }

  /**
   * Validate webhook signature from Pusher
   *
   * Uses timing-safe comparison to prevent timing attacks.
   *
   * @param body - The raw request body as a string
   * @param signature - The X-Pusher-Signature header value
   * @returns true if the signature is valid, false otherwise
   */
  validateWebhookSignature(body: string, signature: string): boolean {
    if (!body || !signature) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.appSecret)
      .update(body)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch {
      // Buffers have different lengths, signatures don't match
      return false;
    }
  }

  /**
   * Compute body MD5 hash for API requests
   *
   * @param body - The request body to hash
   * @returns MD5 hex digest of the body
   */
  computeBodyMd5(body: string): string {
    return crypto.createHash('md5').update(body).digest('hex');
  }

  /**
   * Get the underlying Pusher instance for advanced operations
   *
   * @returns The Pusher client instance
   */
  getPusherInstance(): Pusher {
    return this.pusher;
  }

  /**
   * Get the Pusher app key (useful for client-side configuration)
   *
   * @returns The Pusher app key
   */
  getAppKey(): string {
    return this.appKey;
  }

  /**
   * Get the Pusher cluster (useful for client-side configuration)
   *
   * @returns The Pusher cluster
   */
  getCluster(): string {
    return this.cluster;
  }
}
