import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    const r2Endpoint = this.configService.get<string>('R2_ENDPOINT');
    const isR2 = Boolean(r2Endpoint);

    this.s3 = new AWS.S3(
      isR2
        ? {
            endpoint: r2Endpoint,
            accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get<string>(
              'R2_SECRET_ACCESS_KEY',
            ),
            region: 'auto',
            signatureVersion: 'v4',
            s3ForcePathStyle: true,
          }
        : {
            region: this.configService.get<string>('AWS_REGION'),
          },
    );
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
      throw new Error(`Error in extraction: ${err.message}`);
    }
  }
}
