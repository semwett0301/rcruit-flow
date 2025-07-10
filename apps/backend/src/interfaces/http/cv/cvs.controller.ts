import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { GptService } from /"@/infrastructure/gpt/gpt.service";
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { extractTextFromPdf } from '@/shared/utils/extractTextFromPdf';
import { GptService } from '@/infrastructure/gpt/gpt.service';
import { MinioService } from '@/infrastructure/s3/minio.service';

function parseGptJsonSafe(raw: string): any {
  try {
    const cleaned = raw
      .replace(/```json\s*/i, '') // убираем ```json
      .replace(/```$/, '') // убираем завершающий ```
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      `Failed to parse GPT response as JSON: ${err.message}\nRaw output: ${raw}`,
    );
  }
}

const prompt = (cvText: string) => `
Extract the following information from the CV below:

1. Candidate name - the full name of the candidate.
2. Current employer - the most recent company the candidate has worked for (if unemployed, say "unemployed").
3. Current position - the most recent job title held (empty if unemployed).
4. Age - integer (estimate based on education and career timeline if necessary).
5. Location - city and country where the candidate is currently based.
6. Hard skills - match and list only the predefined technical skills present in the CV (e.g., React, Kotlin, PostgreSQL, etc.).
7. Experience description - summarize the candidate's experience in the software/tech industry.
8. Years of experience - total number of years of relevant professional experience.
9. Degree - a short summary of academic degrees with field of study.

Return your answer as a JSON object in this format:

{
  "name": "...",
  "currentEmployer": "...",
  "currentPosition": "...",
  "age": ...,
  "location": "...",
  "hardSkills": ["...", "..."],
  "experienceDescription": "...",
  "yearsOfExperience": ...,
  "degree": "..."
}

CV content:
""" 
${cvText}
"""
`;

export class ExtractDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fileId: string;
}

@Controller('cvs')
export class CvsController {
  constructor(
    private readonly minioService: MinioService,
    private readonly gpt: GptService,
  ) {}

  @Post('/save')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const bucket = 'my-bucket';
    const fileUrl = await this.minioService.uploadFile(bucket, file);
    return {
      message: 'File uploaded',
      key: fileUrl,
    };
  }

  @Post('extract')
  @ApiBody({ type: ExtractDto })
  async ask(@Body() dto: ExtractDto) {
    const file = await this.minioService.getFile('my-bucket', dto.fileId);

    const text = await extractTextFromPdf(file);

    const result = await this.gpt.chat(
      [
        {
          role: 'system',
          content:
            'You are a helpful assistant that extracts structured information from CVs.',
        },
        { role: 'user', content: prompt(text) },
      ],
      {
        model: 'gpt-4o',
        temperature: 0,
        max_tokens: 1000,
      },
    );

    return parseGptJsonSafe(result);
  }
}
