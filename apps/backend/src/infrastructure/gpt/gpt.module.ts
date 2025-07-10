import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GptService } from "./gpt.service";

@Module({
  imports: [ConfigModule], // чтобы @nestjs/config был доступен
  providers: [GptService],
  exports: [GptService], // ← чтобы сервис можно было инжектировать из-вне
})
export class GptModule {}
