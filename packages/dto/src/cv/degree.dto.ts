import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DegreeLevel } from '../enum';

export class DegreeDto {
  @ApiProperty({ enum: DegreeLevel })
  @IsEnum(DegreeLevel)
  level: DegreeLevel;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  program: string;
}
