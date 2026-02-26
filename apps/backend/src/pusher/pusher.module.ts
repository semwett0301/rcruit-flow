/**
 * Pusher Module
 *
 * This module encapsulates Pusher configuration and service for real-time
 * communication capabilities. It is marked as @Global() to make the
 * PusherService available throughout the application without needing
 * to import this module in every feature module.
 */
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PusherService } from './pusher.service';
import { PusherController } from './pusher.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [PusherController],
  providers: [PusherService],
  exports: [PusherService],
})
export class PusherModule {}
