import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Data Transfer Object for sending emails to candidates
 */
export class SendEmailDto {
  /**
   * Optional candidate email address to send the email to
   * If not provided, the system will use the candidate's default email
   */
  @IsOptional()
  @IsString()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  candidateEmail?: string;

  /**
   * Email subject line
   */
  @IsNotEmpty({ message: 'Subject is required' })
  @IsString()
  subject: string;

  /**
   * Email body content
   */
  @IsNotEmpty({ message: 'Body is required' })
  @IsString()
  body: string;
}
