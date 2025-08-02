import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import {
  Degree,
  DegreeLevel,
  ExtractCvDataRequest,
  ExtractCvDataResult,
  UploadFileDtoRequest,
  UploadFileDtoResponse,
} from '@repo/dto';

export class DegreeDto implements Degree {
  @ApiProperty({ enum: DegreeLevel })
  @IsEnum(DegreeLevel)
  level: DegreeLevel;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  program: string;
}

export class ExtractCvDataResultDto implements ExtractCvDataResult {
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

export class ExtractCvDataDto implements ExtractCvDataRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fileId: string;
}

export class UploadFileDto implements UploadFileDtoRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: string;
}

export class UploadFileResponseDto implements UploadFileDtoResponse {
  @ApiProperty({ example: 'File uploaded successfully' })
  message: string;

  @ApiProperty({ example: 'my-bucket/uploads/image123.png' })
  key: string;
}
