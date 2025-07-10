import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({ example: 'File uploaded successfully' })
  message: string;

  @ApiProperty({ example: 'my-bucket/uploads/image123.png' })
  key: string;
}
