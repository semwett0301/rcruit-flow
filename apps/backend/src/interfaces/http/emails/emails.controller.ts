import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerateEmailUseCase } from 'application/email/use-case/generate-email.use-case';
import { CandidateFormDto, EmailResponseDto } from './emails.dto';

@Controller('emails')
export class EmailsController {
  constructor(private readonly generateEmailUseCase: GenerateEmailUseCase) {}

  @Post('generate')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('jobDescriptionFile'))
  @ApiBody({ type: CandidateFormDto })
  @ApiResponse({ type: EmailResponseDto })
  async generate(@Body() dto: CandidateFormDto): Promise<EmailResponseDto> {
    return await this.generateEmailUseCase.generate(dto);
  }
}
