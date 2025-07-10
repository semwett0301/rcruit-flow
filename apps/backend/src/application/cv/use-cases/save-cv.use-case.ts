import { Injectable } from '@nestjs/common';
import { ExtractCvDataDto } from '../dto/request/extract-cv-data.dto';
import { extractTextFromPdf } from '@/shared/utils/extractTextFromPdf';
import { MinioService } from '@/infrastructure/s3/minio.service';

@Injectable()
export class SaveCvUseCase {
  constructor(private readonly minioService: MinioService) {}

  async saveCV(file: Express.Multer.File) {
    return await this.minioService.uploadFile(file);
  }
}
