import { Injectable } from '@nestjs/common';
import { MinioService } from '@/infrastructure/s3/minio.service';

@Injectable()
export class SaveCvUseCase {
  constructor(private readonly minioService: MinioService) {}

  async saveCV(file: Express.Multer.File) {
    return await this.minioService.uploadFile(file);
  }
}
