import { Injectable } from '@nestjs/common';
import { GptService } from 'infrastructure/gpt/gpt.service';
import {
  generateEmailSystemPrompt,
  generateEmailUserPrompt,
} from 'application/email/prompts/generate-email-user.prompt';
import type { ChatCompletionMessageParam } from 'openai/resources/index';
import { CandidateForm, EmailResponse } from '@repo/dto';

@Injectable()
export class GenerateEmailUseCase {
  constructor(private readonly gpt: GptService) {}

  async generate(dto: CandidateForm): Promise<EmailResponse> {
    const userPrompt = generateEmailUserPrompt({
      dto,
      firstName: this.#getFirstName(dto.candidateName),
      seniority: this.#getSeniority(dto.yearsOfExperience),
      salaryLine: this.#getSalaryLine(dto.salaryPeriod, dto.grossSalary),
      travelClause: this.#getTravelClause(dto.travelMode, dto.minutesOfRoad),
    });

    const gptMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: generateEmailSystemPrompt,
      },
      { role: 'user', content: userPrompt },
    ];

    return {
      email: await this.gpt.chat(gptMessages),
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

  #getTravelClause(
    travelMode: string | undefined,
    minutesOfRoad: number[] | undefined,
  ): string {
    return travelMode
      ? `willing to commute up to ${Math.max(...(minutesOfRoad ?? [0]))} minutes by ${travelMode}.`
      : '';
  }
}
