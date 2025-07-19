import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}
