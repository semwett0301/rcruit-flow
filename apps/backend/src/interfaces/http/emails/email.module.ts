import { Module } from "@nestjs/common";
import { GptModule } from "@/infrastructure/gpt/gpt.module";
import { EmailsController } from "@/interfaces/http/emails/emails.controller";

@Module({
  controllers: [EmailsController],
  imports: [GptModule],
})
export class EmailsModule {}
