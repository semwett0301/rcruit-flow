import { ApiProperty } from '@nestjs/swagger';
import { DegreeLevel } from '@/application/email/enum/degreeLevel.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class DegreeDto {
  @ApiProperty({ enum: DegreeLevel })
  @IsEnum(DegreeLevel)
  level: DegreeLevel;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  program: string;
}
