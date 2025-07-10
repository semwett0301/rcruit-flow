import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CandidateFormDto } from '@/application/email/dto/request/email-candidate-form.dto';
import { GenerateEmailUseCase } from '@/application/email/use-case/generate-email.use-case';

@Controller('emails')
export class EmailsController {
  constructor(private readonly generateEmailUseCase: GenerateEmailUseCase) {}

  @Post('generate')
  @ApiBody({ type: CandidateFormDto })
  async generate(@Body() dto: CandidateFormDto) {
    return await this.generateEmailUseCase.generate(dto);
  }
}
