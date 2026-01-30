/**
 * Email Module
 *
 * This module bundles the email controller and service together,
 * providing email functionality throughout the application.
 * The EmailService is exported for use in other modules.
 */
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
