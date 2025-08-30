import { Module } from '@nestjs/common';
import { GptModule } from 'infrastructure/gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { EmailsController } from 'interfaces/http/emails/emails.controller';
import { GenerateEmailUseCase } from 'application/email/use-case/generate-email.use-case';
import { S3Service } from '../../../infrastructure/s3/s3.service';

@Module({
  imports: [GptModule, ConfigModule],
  controllers: [EmailsController],
  providers: [GenerateEmailUseCase, S3Service],
})
export class EmailsModule {}
