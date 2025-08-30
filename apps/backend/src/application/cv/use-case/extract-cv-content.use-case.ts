import { Injectable, Logger } from '@nestjs/common';
import { extractTextFromPdf } from 'shared/utils/extractTextFromPdf';
import { S3Service } from 'infrastructure/s3/s3.service';
import { GptService } from 'infrastructure/gpt/gpt.service';
import { parseGptJsonSafe } from 'shared/utils/parseGptJsonSave';
import {
  cvDataExtractionSystemPrompt,
  cvDataExtractionUserPrompt,
} from '../prompts/cv-data-extraction-user.prompt';
import { ExtractCvDataRequest, ExtractCvDataResult } from '@repo/dto';

@Injectable()
export class ExtractCvContentUseCase {
  private readonly logger = new Logger(ExtractCvContentUseCase.name);

  constructor(
    private readonly minioService: S3Service,
    private readonly gpt: GptService,
  ) {}

  async extractData(dto: ExtractCvDataRequest): Promise<ExtractCvDataResult> {
    this.logger.log(`Starting CV data extraction for fileId=${dto.fileId}`);

    try {
      const cvText = await this.#extractText(dto.fileId);
      this.logger.debug(`Extracted text length: ${cvText.length} characters`);

      const gptResult = await this.#extractDataFromGpt(cvText);
      this.logger.log(`Received GPT result for fileId=${dto.fileId}`);

      const parsed = parseGptJsonSafe<ExtractCvDataResult>(gptResult);
      this.logger.log(
        `Successfully parsed GPT response for fileId=${dto.fileId}`,
      );

      return parsed;
    } catch (error) {
      this.logger.error(
        `Failed to extract CV data for fileId=${dto.fileId}`,
        error.stack,
      );
      throw error;
    }
  }

  async #extractText(fileId: string) {
    this.logger.debug(`Fetching file from S3: fileId=${fileId}`);
    const file = await this.minioService.getFile(fileId);
    this.logger.debug(`File retrieved successfully: fileId=${fileId}`);
    return await extractTextFromPdf(file);
  }

  async #extractDataFromGpt(text: string) {
    this.logger.debug('Sending text to GPT for processing...');
    const result = await this.gpt.chat(
      [
        {
          role: 'system',
          content: cvDataExtractionSystemPrompt,
        },
        {
          role: 'user',
          content: cvDataExtractionUserPrompt(text),
        },
      ],
      {
        temperature: 0,
      },
    );
    this.logger.debug('Received response from GPT');
    return result;
  }
}
