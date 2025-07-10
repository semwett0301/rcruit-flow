import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExtractCvDataDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fileId: string;
}
