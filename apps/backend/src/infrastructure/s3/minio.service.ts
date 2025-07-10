import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: `${this.configService.get<string>('MINIO_HOST')}:${this.configService.get<string>('MINIO_PORT')}`,
      accessKeyId: this.configService.get<string>('MINIO_ROOT_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>('MINIO_ROOT_SECRET_KEY'),
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    bucket: string = this.configService.get<string>('DEFAULT_BUCKET_NAME'),
  ): Promise<string> {
    const uploadResult = await this.s3
      .upload({
        Bucket: bucket,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    return uploadResult.Key;
  }

  async getFile(
    key: string,
    bucket: string = this.configService.get<string>('DEFAULT_BUCKET_NAME'),
  ): Promise<Buffer> {
    try {
      const object = await this.s3
        .getObject({ Bucket: bucket, Key: key })
        .promise();
      return object.Body as Buffer;
    } catch (err) {
      throw new Error(`Ошибка при получении файла: ${err.message}`);
    }
  }
}
