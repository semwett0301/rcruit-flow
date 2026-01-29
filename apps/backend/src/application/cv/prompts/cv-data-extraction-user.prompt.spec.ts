import {
  cvDataExtractionUserPrompt,
  cvDataExtractionSystemPrompt,
} from './cv-data-extraction-user.prompt';
import { DegreeLevel } from '@repo/dto';

describe('CV Data Extraction Prompts', () => {
  describe('cvDataExtractionUserPrompt', () => {
    it('should include the CV text in the prompt', () => {
      const cvText = 'John Doe - Software Engineer with 5 years experience';
      const result = cvDataExtractionUserPrompt(cvText);

      expect(result).toContain(cvText);
    });

    it('should include all required extraction fields', () => {
      const result = cvDataExtractionUserPrompt('Sample CV');

      expect(result).toContain('Candidate name');
      expect(result).toContain('Current employer');
      expect(result).toContain('Current position');
      expect(result).toContain('Age');
      expect(result).toContain('Location');
      expect(result).toContain('Hard skills');
      expect(result).toContain('Experience description');
      expect(result).toContain('Years of experience');
      expect(result).toContain('degree');
    });

    it('should include JSON structure example', () => {
      const result = cvDataExtractionUserPrompt('Sample CV');

      expect(result).toContain('candidateName');
      expect(result).toContain('currentEmployer');
      expect(result).toContain('hardSkills');
      expect(result).toContain('yearsOfExperience');
      expect(result).toContain('degrees');
    });

    it('should include all DegreeLevel options', () => {
      const result = cvDataExtractionUserPrompt('Sample CV');

      Object.values(DegreeLevel).forEach((level) => {
        expect(result).toContain(level);
      });
    });

    it('should wrap CV content in triple quotes', () => {
      const cvText = 'Test CV content';
      const result = cvDataExtractionUserPrompt(cvText);

      expect(result).toContain('"""');
      expect(result).toContain(`${cvText}`);
    });

    it('should handle empty CV text', () => {
      const result = cvDataExtractionUserPrompt('');

      expect(result).toContain('CV content:');
      expect(result).toContain('"""');
    });

    it('should handle CV text with special characters', () => {
      const cvText = 'John "Jack" O\'Brien - C++ & C# Developer';
      const result = cvDataExtractionUserPrompt(cvText);

      expect(result).toContain(cvText);
    });

    it('should handle multiline CV text', () => {
      const cvText = `Name: John Doe
Experience: 5 years
Skills: JavaScript, TypeScript`;
      const result = cvDataExtractionUserPrompt(cvText);

      expect(result).toContain('Name: John Doe');
      expect(result).toContain('Experience: 5 years');
      expect(result).toContain('Skills: JavaScript, TypeScript');
    });
  });

  describe('cvDataExtractionSystemPrompt', () => {
    it('should be a non-empty string', () => {
      expect(typeof cvDataExtractionSystemPrompt).toBe('string');
      expect(cvDataExtractionSystemPrompt.length).toBeGreaterThan(0);
    });

    it('should describe the assistant role', () => {
      expect(cvDataExtractionSystemPrompt).toContain('helpful assistant');
      expect(cvDataExtractionSystemPrompt).toContain('CVs');
    });
  });
});
