import {
  CandidateForm,
  EmailResponse,
  SalaryPeriod,
  TravelModeEnum,
} from '@repo/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExtractCvDataResultDto } from '../cv/cvs.dto';

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

  @ApiProperty({ type: String })
  targetRole: string;

  @ApiPropertyOptional()
  @IsOptional()
  ambitions?: string;

  @ApiPropertyOptional({ enum: TravelModeEnum })
  @IsOptional()
  @IsEnum(TravelModeEnum)
  travelMode?: TravelModeEnum;

  @ValidateIf((o) => !!o.travelMode)
  @ApiPropertyOptional({ type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minutesOfRoad?: number;

  @ValidateIf((o) => !!o.travelMode)
  @ApiPropertyOptional({ type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  onSiteDays?: number;

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

  jobDescriptionFile?: Express.Multer.File;
}

export class EmailResponseDto implements EmailResponse {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}
