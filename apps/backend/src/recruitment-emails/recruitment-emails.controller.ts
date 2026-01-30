import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RecruitmentEmailsService } from './recruitment-emails.service';

/**
 * DTO for sending recruitment emails
 */
export class SendRecruitmentEmailDto {
  @IsString()
  @IsNotEmpty()
  candidateId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  templateData?: Record<string, unknown>;
}

/**
 * Controller for handling recruitment email operations
 */
@Controller('recruitment-emails')
export class RecruitmentEmailsController {
  constructor(
    private readonly recruitmentEmailsService: RecruitmentEmailsService,
  ) {}

  /**
   * Send a recruitment email to a candidate
   * @param sendDto - The DTO containing candidate ID, email, and optional template data
   */
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async send(@Body() sendDto: SendRecruitmentEmailDto): Promise<void> {
    return this.recruitmentEmailsService.sendRecruitmentEmail(
      sendDto.candidateId,
      sendDto.email,
      sendDto.templateData,
    );
  }
}
