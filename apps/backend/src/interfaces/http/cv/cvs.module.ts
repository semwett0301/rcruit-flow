import { Module } from "@nestjs/common";
import { CvsController } from "@/interfaces/http/cv/cvs.controller";
import { MinioService } from "@/infrastructure/s3/minio.service";
import { GptModule } from "@/infrastructure/gpt/gpt.module";

@Module({
  controllers: [CvsController],
  providers: [MinioService],
  imports: [GptModule],
})
export class CvsModule {}
