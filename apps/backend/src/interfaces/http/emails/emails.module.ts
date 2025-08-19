import { Module } from '@nestjs/common';
import { GptModule } from 'infrastructure/gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { EmailsController } from 'interfaces/http/emails/emails.controller';
import { GenerateEmailUseCase } from 'application/email/use-case/generate-email.use-case';
import { R2Service } from 'infrastructure/s3/minio.service';

@Module({
  imports: [GptModule, ConfigModule],
  controllers: [EmailsController],
  providers: [GenerateEmailUseCase, R2Service],
})
export class EmailsModule {}
