import { Injectable } from '@nestjs/common';
import { S3Service } from '../../../infrastructure/s3/s3.service';

@Injectable()
export class SaveCvUseCase {
  constructor(private readonly minioService: S3Service) {}

  async saveCV(file: Express.Multer.File) {
    return await this.minioService.uploadFile(file);
  }
}
