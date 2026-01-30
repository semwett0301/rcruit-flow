/**
 * Email Controller
 *
 * Handles HTTP requests for email-related operations including
 * email generation with proper validation.
 */
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { GenerateEmailDto } from './dto/generate-email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Generate an email based on the provided parameters.
   *
   * @param generateEmailDto - The DTO containing email generation parameters
   * @returns The generated email content from the email service
   */
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {}).join(', '),
        }));
        return new BadRequestException({
          message: 'Validation failed',
          errors: messages,
        });
      },
    }),
  )
  async generateEmail(@Body() generateEmailDto: GenerateEmailDto) {
    return this.emailService.generateEmail(generateEmailDto);
  }
}
