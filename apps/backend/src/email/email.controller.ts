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
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { GenerateEmailDto } from './dto/generate-email.dto';

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
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : [];
          if (error.children && error.children.length > 0) {
            const childMessages = error.children.map((child) => {
              const childConstraints = child.constraints
                ? Object.values(child.constraints)
                : [];
              return childConstraints.join(', ');
            });
            return childMessages.join(', ');
          }
          return constraints.join(', ');
        });
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: messages.filter((m) => m),
        });
      },
    }),
  )
  async generateEmail(@Body() generateEmailDto: GenerateEmailDto) {
    return this.emailService.generateEmail(generateEmailDto);
  }
}
