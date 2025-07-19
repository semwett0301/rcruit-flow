import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DegreeDto } from './degree.dto';

export class ExtractCvDataResultDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  candidateName: string;

  @ValidateIf((o) => !o.employmentStatus)
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  currentEmployer?: string;

  @ValidateIf((o) => !o.employmentStatus)
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  currentPosition?: string;

  @ApiProperty({ minimum: 18 })
  @Type(() => Number)
  @IsInt()
  @Min(18)
  age: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(0)
  hardSkills: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  experienceDescription: string;

  @ApiProperty({ minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  yearsOfExperience: number;

  @ValidateIf((o) => !o.graduationStatus)
  @ApiPropertyOptional({ type: DegreeDto })
  degree?: DegreeDto;
}
