import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { GenerateEmailUseCase } from 'application/email/use-case/generate-email.use-case';
import { CandidateFormDto, EmailResponseDto } from '@repo/dto';

@Controller('emails')
export class EmailsController {
  constructor(private readonly generateEmailUseCase: GenerateEmailUseCase) {}

  @Post('generate')
  @ApiBody({ type: CandidateFormDto })
  @ApiResponse({ type: EmailResponseDto })
  async generate(@Body() dto: CandidateFormDto): Promise<EmailResponseDto> {
    return await this.generateEmailUseCase.generate(dto);
  }
}
