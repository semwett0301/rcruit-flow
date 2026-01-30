import { Injectable, BadRequestException } from '@nestjs/common';
import { CandidatesService } from '../candidates/candidates.service';
import { EmailService } from '../email/email.service';

/**
 * Service for handling recruitment email operations.
 * Manages sending recruitment emails to candidates with email validation
 * and automatic email update functionality.
 */
@Injectable()
export class RecruitmentEmailsService {
  constructor(
    private readonly candidatesService: CandidatesService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Sends a recruitment email to a candidate using the provided email address.
   * Validates the email format and updates the candidate's stored email if different.
   *
   * @param candidateId - The unique identifier of the candidate
   * @param email - The email address to send the recruitment email to
   * @param templateData - Data to populate the email template
   * @throws BadRequestException if the email format is invalid
   */
  async sendRecruitmentEmail(
    candidateId: string,
    email: string,
    templateData: any,
  ): Promise<void> {
    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    const candidate = await this.candidatesService.findOne(candidateId);

    // Update candidate email if different
    if (candidate.email !== email) {
      await this.candidatesService.updateEmail(candidateId, email);
    }

    // Send email using the provided email address
    await this.emailService.send({
      to: email,
      subject: templateData.subject || 'Recruitment Opportunity',
      template: templateData.template,
      context: {
        candidateName: candidate.name,
        ...templateData.context,
      },
    });
  }

  /**
   * Validates an email address format using a regex pattern.
   *
   * @param email - The email address to validate
   * @returns true if the email format is valid, false otherwise
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
