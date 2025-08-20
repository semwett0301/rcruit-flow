import {
  CandidateForm,
  EmailResponse,
  SalaryPeriod,
  TravelModeEnum,
  TravelOption,
} from '@repo/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExtractCvDataResultDto } from '../cv/cvs.dto';

export class TravelOptionDto implements TravelOption {
  @ApiProperty({ enum: TravelModeEnum })
  @IsEnum(TravelModeEnum)
  travelMode: TravelModeEnum;

  @ApiProperty({ minimum: 0 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  minutesOfRoad?: number;

  @ApiProperty({ minimum: 0, maximum: 5 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  onSiteDays?: number;
}

export class CandidateFormDto
  extends ExtractCvDataResultDto
  implements CandidateForm
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recruiterName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({
    type: [String],
    description: 'List of focus roles (at least one required)',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  focusRoles: string[];

  @ApiPropertyOptional()
  @IsOptional()
  ambitions?: string;

  @ApiPropertyOptional({ type: [Object], isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TravelOptionDto)
  travelOptions: TravelOptionDto[];

  @ApiProperty({ minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  grossSalary: number;

  @ApiProperty({ enum: SalaryPeriod })
  @IsEnum(SalaryPeriod)
  salaryPeriod: SalaryPeriod;

  @ApiProperty({ enum: [8, 16, 24, 32, 40] })
  @Type(() => Number)
  @IsInt()
  hoursAWeek: 8 | 16 | 24 | 32 | 40;

  @ValidateIf((o) => !o.jobDescriptionFile)
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobDescriptionText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobDescriptionFile?: string;
}

export class EmailResponseDto implements EmailResponse {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}
