import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";

@Injectable()
export class MinioService {
  private readonly s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: "http://localhost:9000",
      accessKeyId: "minio",
      secretAccessKey: "minio123",
      s3ForcePathStyle: true,
      signatureVersion: "v4",
    });
  }

  async uploadFile(bucket: string, file: Express.Multer.File): Promise<string> {
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

  async getFile(bucket: string, key: string): Promise<Buffer> {
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
