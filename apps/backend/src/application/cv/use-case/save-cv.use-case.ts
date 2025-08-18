import { Injectable } from '@nestjs/common';
import { R2Service } from 'infrastructure/s3/minio.service';

@Injectable()
export class SaveCvUseCase {
  constructor(private readonly minioService: R2Service) {}

  async saveCV(file: Express.Multer.File) {
    return await this.minioService.uploadFile(file);
  }
}
