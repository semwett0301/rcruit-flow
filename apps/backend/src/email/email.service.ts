import { Injectable, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CandidatesService } from '../candidates/candidates.service';

/**
 * Parameters for sending recruitment emails
 */
export interface SendRecruitmentEmailParams {
  /** The candidate's unique identifier */
  candidateId: string;
  /** Email address to send the recruitment email to (overrides candidate record) */
  email: string;
  /** Subject line for the email */
  subject?: string;
  /** Email template name to use */
  template?: string;
  /** Additional context data for the email template */
  context?: Record<string, unknown>;
}

/**
 * Service responsible for handling email operations,
 * particularly recruitment-related emails.
 */
@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly candidatesService: CandidatesService,
  ) {}

  /**
   * Sends a recruitment email to the specified email address.
   * Validates the email format and optionally updates the candidate record.
   *
   * @param params - The parameters for sending the recruitment email
   * @throws BadRequestException if the email address is invalid
   */
  async sendRecruitmentEmail(params: SendRecruitmentEmailParams): Promise<void> {
    const {
      candidateId,
      email,
      subject = 'Recruitment Opportunity',
      template = 'recruitment',
      context = {},
    } = params;

    // Validate email format on backend as well
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email address');
    }

    // Use the provided email for sending
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: {
        candidateId,
        ...context,
      },
    });

    // Update the candidate record with the new email
    await this.candidatesService.update(candidateId, { email });
  }

  /**
   * Validates an email address format.
   *
   * @param email - The email address to validate
   * @returns true if the email format is valid, false otherwise
   */
  private isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }
}
