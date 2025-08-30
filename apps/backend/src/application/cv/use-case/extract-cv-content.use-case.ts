import { Injectable } from '@nestjs/common';
import { extractTextFromPdf } from 'shared/utils/extractTextFromPdf';
import { S3Service } from '../../../infrastructure/s3/s3.service';
import { GptService } from 'infrastructure/gpt/gpt.service';
import { parseGptJsonSafe } from 'shared/utils/parseGptJsonSave';
import {
  cvDataExtractionSystemPrompt,
  cvDataExtractionUserPrompt,
} from '../prompts/cv-data-extraction-user.prompt';
import { ExtractCvDataRequest, ExtractCvDataResult } from '@repo/dto';

@Injectable()
export class ExtractCvContentUseCase {
  constructor(
    private readonly minioService: S3Service,
    private readonly gpt: GptService,
  ) {}

  async extractData(dto: ExtractCvDataRequest): Promise<ExtractCvDataResult> {
    const cvText = await this.#extractText(dto.fileId);
    const gptResult = await this.#extractDataFromGpt(cvText);

    return parseGptJsonSafe<ExtractCvDataResult>(gptResult);
  }

  async #extractText(fileId: string) {
    const file = await this.minioService.getFile(fileId);
    return await extractTextFromPdf(file);
  }

  async #extractDataFromGpt(text: string) {
    return await this.gpt.chat(
      [
        {
          role: 'system',
          content: cvDataExtractionSystemPrompt,
        },
        { role: 'user', content: cvDataExtractionUserPrompt(text) },
      ],
      {
        temperature: 0,
      },
    );
  }
}
