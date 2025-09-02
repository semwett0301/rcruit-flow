import { Injectable, Logger } from '@nestjs/common';
import { GptService } from 'infrastructure/gpt/gpt.service';
import {
  generateEmailSystemPrompt,
  generateEmailUserPrompt,
} from 'application/email/prompts/generate-email-user.prompt';
import type { ChatCompletionMessageParam } from 'openai/resources/index';
import {
  CandidateForm,
  EmailResponse,
  TravelModeEnum,
  TravelOption,
} from '@repo/dto';
import { extractTextFromPdf } from '../../../shared/utils/extractTextFromPdf';
import { S3Service } from '../../../infrastructure/s3/s3.service';

@Injectable()
export class GenerateEmailUseCase {
  private readonly logger = new Logger(GenerateEmailUseCase.name);

  constructor(
    private readonly gpt: GptService,
    private readonly r2Service: S3Service,
  ) {}

  async generate(dto: CandidateForm): Promise<EmailResponse> {
    if (dto.jobDescriptionFile) {
      const file = await this.r2Service.getFile(dto.jobDescriptionFile);
      dto.jobDescriptionText = await extractTextFromPdf(file);
    }

    this.logger.debug(`Final job description text: ${dto.jobDescriptionText}`);

    const userPrompt = generateEmailUserPrompt({
      dto,
      firstName: this.#getFirstName(dto.candidateName),
      seniority: this.#getSeniority(dto.yearsOfExperience),
      salaryLine: this.#getSalaryLine(dto.salaryPeriod, dto.grossSalary),
      travelClause: this.#getTravelClause(dto.travelOptions),
    });

    this.logger.debug(`Created user prompt: ${userPrompt}`);

    const gptMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: generateEmailSystemPrompt,
      },
      { role: 'user', content: userPrompt },
    ];

    const email = await this.gpt.chat(gptMessages);

    this.logger.debug(`Final email: ${email}`);

    return {
      email,
    };
  }

  #getFirstName(candidateName: string): string {
    return candidateName.split(' ')[0];
  }

  #getSeniority(yearsOfExperience: number): string {
    if (yearsOfExperience >= 5) return 'Senior';
    if (yearsOfExperience >= 3) return 'Medior';
    return 'Junior';
  }

  #getSalaryLine(salaryPeriod: string, grossSalary: number): string {
    return salaryPeriod === 'year'
      ? `€${grossSalary.toLocaleString('en-US')} all-in per year`
      : `€${grossSalary.toLocaleString('en-US')} gross / month`;
  }

  #getTravelClause(travelModes: TravelOption[]): string {
    if (travelModes.length === 0) {
      return '';
    }

    return `willing to commute up to ${travelModes.map((el) => (el.travelMode === TravelModeEnum.REMOTE ? 'only remote' : `${el.minutesOfRoad ?? 0} minutes by ${el.travelMode} with ${el.onSiteDays ?? 0} on-site days`)).join(' or ')}.`;
  }
}
