/**
 * DTO for Pusher authentication request validation.
 * Used to validate incoming requests for Pusher channel authentication.
 */
import { IsString, IsNotEmpty, Matches } from 'class-validator';

/**
 * DTO for validating Pusher authentication requests.
 * Validates socket_id format and ensures channel is a private channel.
 */
export class PusherAuthDto {
  /**
   * The unique socket identifier provided by Pusher.
   * Must match the format: digits.digits (e.g., "123456.789012")
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+$/, { message: 'Invalid socket_id format' })
  socket_id: string;

  /**
   * The name of the channel the client is attempting to subscribe to.
   * Must be a private channel (prefixed with "private-").
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^private-/, { message: 'Channel must be a private channel' })
  channel_name: string;
}

/**
 * DTO for mock event requests.
 * Used for testing and development purposes to simulate Pusher events.
 */
export class MockEventDto {
  /**
   * The channel to send the event to.
   */
  @IsString()
  @IsNotEmpty()
  channel: string;

  /**
   * The event name/type.
   */
  @IsString()
  @IsNotEmpty()
  event: string;

  /**
   * The event payload data.
   * Can be any type of data to be sent with the event.
   */
  data: any;
}
