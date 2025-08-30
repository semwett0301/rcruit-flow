import { Module } from '@nestjs/common';
import { CvsController } from 'interfaces/http/cv/cvs.controller';
import { S3Service } from '../../../infrastructure/s3/s3.service';
import { GptModule } from 'infrastructure/gpt/gpt.module';
import { ExtractCvContentUseCase } from 'application/cv/use-case/extract-cv-content.use-case';
import { SaveCvUseCase } from 'application/cv/use-case/save-cv.use-case';

@Module({
  controllers: [CvsController],
  providers: [ExtractCvContentUseCase, SaveCvUseCase, S3Service],
  imports: [GptModule],
})
export class CvsModule {}
