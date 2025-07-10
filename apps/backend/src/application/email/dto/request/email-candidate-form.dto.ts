import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { TravelModeEnum } from '@/application/email/enum/travelMode.enum';
import { SalaryPeriod } from '@/application/email/enum/salaryPeriod.enum';
import { DegreeDto } from './email-degree.dto';

export class CandidateFormDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  candidateName: string;

  @ApiProperty({ description: 'Is candidate unemployed?' })
  @IsBoolean()
  employmentStatus: boolean;

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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recruiterName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
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

  @ApiProperty({ description: 'Is candidate ungraduated?' })
  @IsBoolean()
  graduationStatus: boolean; // true = ungraduated

  @ValidateIf((o) => !o.graduationStatus)
  @ApiPropertyOptional({ type: DegreeDto })
  degree?: DegreeDto;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  targetRoles: string[];

  @ApiPropertyOptional()
  @IsOptional()
  ambitions?: string;

  @ApiPropertyOptional({ enum: TravelModeEnum })
  @IsOptional()
  @IsEnum(TravelModeEnum)
  travelMode?: TravelModeEnum;

  @ValidateIf((o) => !!o.travelMode)
  @ApiPropertyOptional({ type: [Number] })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  minutesOfRoad?: number[];

  @ValidateIf((o) => !!o.travelMode)
  @ApiPropertyOptional({ type: [Number] })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  onSiteDays?: number[];

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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetName: string;

  @ValidateIf((o) => !o.jobDescriptionFile)
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobDescriptionText?: string;

  jobDescriptionFile?: Express.Multer.File;
}
