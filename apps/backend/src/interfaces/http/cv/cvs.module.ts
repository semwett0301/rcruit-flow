import { Module } from '@nestjs/common';
import { CvsController } from 'interfaces/http/cv/cvs.controller';
import { R2Service } from 'infrastructure/s3/minio.service';
import { GptModule } from 'infrastructure/gpt/gpt.module';
import { ExtractCvContentUseCase } from 'application/cv/use-case/extract-cv-content.use-case';
import { SaveCvUseCase } from 'application/cv/use-case/save-cv.use-case';

@Module({
  controllers: [CvsController],
  providers: [ExtractCvContentUseCase, SaveCvUseCase, R2Service],
  imports: [GptModule],
})
export class CvsModule {}
