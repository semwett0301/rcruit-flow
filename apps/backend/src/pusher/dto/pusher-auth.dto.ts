/**
 * DTO for Pusher authentication request validation.
 * Used to validate incoming requests for Pusher channel authentication.
 */
import { IsString, IsNotEmpty } from 'class-validator';

export class PusherAuthDto {
  /**
   * The unique socket identifier provided by Pusher.
   */
  @IsString()
  @IsNotEmpty()
  socket_id: string;

  /**
   * The name of the channel the client is attempting to subscribe to.
   */
  @IsString()
  @IsNotEmpty()
  channel_name: string;
}
