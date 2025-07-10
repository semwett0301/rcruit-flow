import { CandidateFormDto } from '@repo/dto';

interface GenerateEmailPromptParams {
  dto: CandidateFormDto;
  firstName: string;
  seniority: string;
  salaryLine: string;
  travelClause: string;
}

export function generateEmailUserPrompt({
  dto,
  firstName,
  seniority,
  salaryLine,
  travelClause,
}: GenerateEmailPromptParams): string {
  return `
You are an email generator. Fill the template below using the candidate data provided.

Do NOT return JSON. Do NOT use markdown. Just return a plain email: subject + body.

### Template:
Subject: CV – {{seniorityDescriptor}} {{targetRole}} | {{completedDegreeOrCert}}

Hi {{contactName}},  

Please find attached the CV of {{candidateFirstName}}, a {{seniorityDescriptor}} {{targetRole}} with {{yearsExperience}} years of experience.  

• Background – worked across {{sectorsSentence}}  
• Technical expertise – strong in {{coreTechSentence}}{{softTraitBullet}}

Currently open to new opportunities because {{motivationReason}} and looking for a role that offers {{ambitionSentence}}.  

Tech stack – {{techStackInline}}  

Location – based in {{residence}}, ${travelClause}
Salary indication – ${salaryLine}  

Let me know if you’d like to schedule an intro meeting; I’ll propose a few time slots.  

Best regards,  
${dto.recruiterName}

### Candidate data:
${JSON.stringify(dto, null, 2)}

### Field mapping rules:
- seniorityDescriptor → "${seniority}"
- targetRole → first item in targetRoles
- completedDegreeOrCert → use degree if available
- Remove bullets or clauses if no data
- Use ${firstName} for candidateFirstName
- Use ${dto.contactName} for contactName
- Format it exactly as a plain email
`;
}

export const generateEmailSystemPrompt =
  'You are a helpful assistant that strictly follows templates to generate recruiter emails.';
