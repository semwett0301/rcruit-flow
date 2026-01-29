import {
  generateEmailUserPrompt,
  generateEmailSystemPrompt,
} from './generate-email-user.prompt';
import { candidateFormFixture } from '../../../../test/fixtures/email.fixture';

describe('Generate Email Prompts', () => {
  describe('generateEmailUserPrompt', () => {
    const defaultParams = {
      dto: candidateFormFixture,
      firstName: 'Jane',
      seniority: 'Senior',
      salaryLine: '€75,000 all-in per year',
      travelClause: 'willing to commute up to 30 minutes by Car',
    };

    it('should include all provided parameters', () => {
      const result = generateEmailUserPrompt(defaultParams);

      expect(result).toContain('Senior');
      expect(result).toContain('€75,000 all-in per year');
      expect(result).toContain('Jane');
      expect(result).toContain('30 minutes by Car');
    });

    it('should include the DTO as JSON', () => {
      const result = generateEmailUserPrompt(defaultParams);

      expect(result).toContain(candidateFormFixture.candidateName);
      expect(result).toContain(candidateFormFixture.recruiterName);
      expect(result).toContain(candidateFormFixture.contactName);
    });

    it('should include instructions for plain text email', () => {
      const result = generateEmailUserPrompt(defaultParams);

      expect(result).toContain('Do NOT return JSON');
      expect(result).toContain('Do NOT use markdown');
      expect(result).toContain('plain email');
    });

    it('should include email structure guidance', () => {
      const result = generateEmailUserPrompt(defaultParams);

      expect(result).toContain('Greeting');
      expect(result).toContain('Attachment statement');
      expect(result).toContain('Technical & soft skills');
      expect(result).toContain('Motivation & ambition');
      expect(result).toContain('Salary indication');
      expect(result).toContain('Call to action');
    });

    it('should handle Junior seniority', () => {
      const params = { ...defaultParams, seniority: 'Junior' };
      const result = generateEmailUserPrompt(params);

      expect(result).toContain('Junior');
    });

    it('should handle Medior seniority', () => {
      const params = { ...defaultParams, seniority: 'Medior' };
      const result = generateEmailUserPrompt(params);

      expect(result).toContain('Medior');
    });

    it('should handle monthly salary format', () => {
      const params = {
        ...defaultParams,
        salaryLine: '€6,250 gross / month',
      };
      const result = generateEmailUserPrompt(params);

      expect(result).toContain('€6,250 gross / month');
    });

    it('should handle empty travel clause', () => {
      const params = { ...defaultParams, travelClause: '' };
      const result = generateEmailUserPrompt(params);

      expect(result).toContain('Travel option for the candidate:');
    });

    it('should handle remote-only travel clause', () => {
      const params = { ...defaultParams, travelClause: 'only remote' };
      const result = generateEmailUserPrompt(params);

      expect(result).toContain('only remote');
    });

    it('should include data mapping sections', () => {
      const result = generateEmailUserPrompt(defaultParams);

      expect(result).toContain('Seniority level:');
      expect(result).toContain('Salary:');
      expect(result).toContain('Candidate first name:');
      expect(result).toContain('Travel option for the candidate:');
    });

    it('should include rules about accuracy', () => {
      const result = generateEmailUserPrompt(defaultParams);

      expect(result).toContain('NEVER add details');
      expect(result).toContain('not explicitly present');
    });
  });

  describe('generateEmailSystemPrompt', () => {
    it('should be a non-empty string', () => {
      expect(typeof generateEmailSystemPrompt).toBe('string');
      expect(generateEmailSystemPrompt.length).toBeGreaterThan(0);
    });

    it('should describe the AI recruitment assistant role', () => {
      expect(generateEmailSystemPrompt).toContain('recruitment assistant');
      expect(generateEmailSystemPrompt).toContain('IT recruitment');
    });

    it('should include core responsibilities', () => {
      expect(generateEmailSystemPrompt).toContain('Candidate Management');
      expect(generateEmailSystemPrompt).toContain('Client Management');
      expect(generateEmailSystemPrompt).toContain('Process Optimization');
    });

    it('should include accuracy rules', () => {
      expect(generateEmailSystemPrompt).toContain('No assumptions');
      expect(generateEmailSystemPrompt).toContain('factually accurate');
      expect(generateEmailSystemPrompt).toContain('not written');
      expect(generateEmailSystemPrompt).toContain('exist');
    });

    it('should include style guidelines', () => {
      expect(generateEmailSystemPrompt).toContain('Direct and professional');
      expect(generateEmailSystemPrompt).toContain('No fluff');
    });
  });
});
