import { Body, Controller, Post } from "@nestjs/common";
// import { GptService } from /"@/infrastructure/gpt/gpt.service";
import { GptService } from "@/infrastructure/gpt/gpt.service";
// dto/candidate-form.dto.ts
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
} from "class-validator";
import { Type } from "class-transformer";
import { ApiBody, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum TravelMode {
  CAR = "car",
  PUBLIC = "public transport",
  BICYCLE = "bicycle",
  WALK = "on walk",
}

export enum SalaryPeriod {
  YEAR = "year",
  MONTH = "month",
}

export enum DegreeLevel {
  BACHELOR = "Bachelor",
  MASTER = "Master",
  PHD = "PhD",
}

class DegreeDto {
  @ApiProperty({ enum: DegreeLevel })
  @IsEnum(DegreeLevel)
  level: DegreeLevel;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  program: string;
}

export class CandidateFormDto {
  // ─────────────── 1. Личные данные ───────────────
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  candidateName: string;

  @ApiProperty({ description: "Is candidate unemployed?" })
  @IsBoolean()
  employmentStatus: boolean; // true = unemployed

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

  // ─────────────── 2. Навыки и опыт ───────────────
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

  // ─────────────── 3. Образование ───────────────
  @ApiProperty({ description: "Is candidate ungraduated?" })
  @IsBoolean()
  graduationStatus: boolean; // true = ungraduated

  @ValidateIf((o) => !o.graduationStatus)
  @ApiPropertyOptional({ type: DegreeDto })
  degree?: DegreeDto;

  // ─────────────── 4. Целевые роли и амбиции ───────────────
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  targetRoles: string[];

  @ApiPropertyOptional()
  @IsOptional()
  ambitions?: string;

  // ─────────────── 5. Travel Preferences ───────────────
  @ApiPropertyOptional({ enum: TravelMode })
  @IsOptional()
  @IsEnum(TravelMode)
  travelMode?: TravelMode;

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

  // ─────────────── 6. Зарплата и часы ───────────────
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

  // ─────────────── 7. Шаг 3 (описание вакансии) ───────────────
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetName: string;

  /** Один из двух: либо текст, либо PDF-файл */
  @ValidateIf((o) => !o.jobDescriptionFile)
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobDescriptionText?: string;

  // Поле добавится в контроллере после загрузки файла
  jobDescriptionFile?: Express.Multer.File;
}

@Controller("emails")
export class EmailsController {
  constructor(private readonly gpt: GptService) {}

  @Post("submit")
  @ApiBody({ type: CandidateFormDto })
  async submit(@Body() dto: CandidateFormDto) {
    const recruiterName = "Maxim";

    const contactName = "Marc";

    const firstName = dto.candidateName.split(" ")[0];

    const seniority =
      dto.yearsOfExperience >= 5
        ? "Senior"
        : dto.yearsOfExperience >= 3
          ? "Medior"
          : "Junior";

    const salaryLine =
      dto.salaryPeriod === "year"
        ? `€${dto.grossSalary.toLocaleString("en-US")} all-in per year`
        : `€${dto.grossSalary.toLocaleString("en-US")} gross / month`;

    const travelClause = dto.travelMode
      ? `willing to commute up to ${Math.max(...(dto.minutesOfRoad ?? [0]))} minutes by ${dto.travelMode}.`
      : "";

    const prompt = `
You are an email generator. Fill the template below using the candidate data provided.

Do NOT return JSON. Do NOT use markdown. Just return a plain email: subject + body.

### Template:
Subject: CV – {{seniorityDescriptor}} {{targetRole}} | {{completedDegreeOrCert}}

Hi {{contactName}},  

Please find attached the CV of {{candidateFirstName}}, a {{seniorityDescriptor}} {{targetRole}} with {{yearsExperience}} years of experience.  

• Background – worked across {{sectorsSentence}}  
• Technical expertise – strong in {{coreTechSentence}}{{softTraitBullet}}

Currently open to new opportunities because {{motivationReason}} and looking for a role that offers {{ambitionSentence}}.  

Tech stack – {{techStackInline}}  

Location – based in {{residence}}, ${travelClause}
Salary indication – ${salaryLine}  

Let me know if you’d like to schedule an intro meeting; I’ll propose a few time slots.  

Best regards,  
${recruiterName}

### Candidate data:
${JSON.stringify(dto, null, 2)}

### Field mapping rules:
- seniorityDescriptor → "${seniority}"
- targetRole → first item in targetRoles
- completedDegreeOrCert → use degree if available
- Remove bullets or clauses if no data
- Use ${firstName} for candidateFirstName
- Use ${contactName} for contactName
- Format it exactly as a plain email
`;

    const raw = await this.gpt.chat(
      [
        {
          role: "system",
          content:
            "You are a helpful assistant that strictly follows templates to generate recruiter emails.",
        },
        { role: "user", content: prompt },
      ],
      {
        model: "gpt-4o",
        temperature: 0.1,
        max_tokens: 1000,
      },
    );

    return {
      email: raw,
    };
  }
}
