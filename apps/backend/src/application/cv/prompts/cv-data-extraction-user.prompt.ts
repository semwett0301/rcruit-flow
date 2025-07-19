export const cvDataExtractionUserPrompt = (cvText: string) => `
Extract the following information from the CV below:

1. Candidate name - the full name of the candidate.
2. Current employer - the most recent company the candidate has worked for (if unemployed, say "unemployed").
3. Current position - the most recent job title held (empty if unemployed).
4. Age - integer (estimate based on education and career timeline if necessary).
5. Location - city and country where the candidate is currently based.
6. Hard skills - match and list only the predefined technical skills present in the CV (e.g., React, Kotlin, PostgreSQL, etc.).
7. Experience description - summarize the candidate's experience in the software/tech industry.
8. Years of experience - total number of years of relevant professional experience.
9. Degree - a short summary of academic degrees with field of study.

Return your answer as a JSON object in this format:

{
  "candidateName": "...",
  "currentEmployer": "...",
  "currentPosition": "...",
  "age": ...,
  "location": "...",
  "hardSkills": ["...", "..."],
  "experienceDescription": "...",
  "yearsOfExperience": ...,
  "degree": "..."
}

CV content:
""" 
${cvText}
"""
`;

export const cvDataExtractionSystemPrompt =
  'You are a helpful assistant that extracts structured information from CVs.';
