import { Module } from '@nestjs/common';
import { GptModule } from 'infrastructure/gpt/gpt.module';
import { EmailsController } from 'interfaces/http/emails/emails.controller';
import { GenerateEmailUseCase } from 'application/email/use-case/generate-email.use-case';

@Module({
  controllers: [EmailsController],
  providers: [GenerateEmailUseCase],
  imports: [GptModule],
})
export class EmailsModule {}
