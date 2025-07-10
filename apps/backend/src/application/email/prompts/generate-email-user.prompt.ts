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
Do NOT return JSON. Do NOT use markdown. Just return a plain email: subject + body.

### Template:
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
- Pay attention to candidates ambition
- Link candidates core qualities to the job description

ALLOWED: YOU ARE FREE TO CHANGE THE EMAIL STRUCTURE, JUST PUT ALL THE CONTENT IN THE EMAIL AND LOGICALLY LINK IT 
OBLIGATED: 
- KEEP THE EMAIL IN ENGLISH
- FOLLOW THE TEMPLATES AND STYLE PROVIDED BELOW, DON'T MAKE AN EMAIL OVER STRUCTURED, MAKE IT MORE HUMAN-LIKE
- DON'T ADD SUBJECT AT ALL

### Email examples

“Hi Marc,
Attached is the profile of Clifton Roozendal.

Clifton is 32 years old and has completed two Master’s degrees simultaneously in
Computer Science and Information Science at the VU and UvA. He has a broad
technical background, with experience in Java, Python, and C++, and is flexible when it
comes to working with other languages and technologies.

In his next role, Clifton is primarily looking for an environment where he can further
strengthen his foundation as a Software Engineer. At the same time, he’s open to a
broader scope as long as he can make an impact and continue learning.
What sets Clifton apart is his combination of technical sharpness and strong
interpersonal skills. He thrives on collaboration with colleagues and clients and values
knowledge sharing, a learning culture, and growth opportunities.

He lives in Hoorn and is willing to commute up to 90 minutes by car. A hybrid setup (1–2
days working from home, depending on travel time) is preferred.
Salary indication: €3,400 gross/month based on 40 hours.

Let me know if you’d be open to an introduction.

Best regards,
Maxim”

--------------------------

“Hi Ernst,

Attached is the profile of Berry van Halderen, a highly experienced and versatile
Software Engineer with an academic background in Computer Science (MSc equivalent)
and over 25 years of experience in network-related and backend-heavy environments.
Berry is 54 years old and has worked at organizations such as NLnet Labs, Hippo, and
the Vrije Universiteit. He combines deep expertise in Java, C/C++, DNS, and security
with strong architectural insight. He has led projects such as OpenDNSSEC and
SoftHSM (part of the backbone of the internet) and has delivered international training
sessions on DNSSEC.

He’s known for his ability to both understand and build complex systems. Berry is
hands-on, pragmatic, and prefers working in smaller organizations where knowledge
sharing, collaboration, and craftsmanship are key. He’s happy to take on lead or
architectural responsibilities, as long as he can remain involved in the technical work.
In terms of stack, Berry is flexible: Java, C, C++, Rust, Python – he’s proficient across the
board. He’s also open to front-end work or picking up new technologies when needed.

He’s currently exploring new opportunities because he has hit a ceiling at his current
employer in terms of content, growth, and compensation.

Berry lives in Assendelft, commutes by motorcycle, and is flexible regarding oYice days
(3 to 4 days per week is no problem).

Salary indication: €5,750 – €6,500 gross/month based on 40 hours. For the right
environment, he is open to stepping in slightly lower, provided there’s room to grow over
time.

Let me know if you’d be open to an introduction. 

Best regards,
Maxim”

-------------------------

Hi Ash,
Zie bijgaand het CV van Ferrie.
Ferrie is net 50 jaar oud en omschrijf ik als een zeer vriendelijk, rustig en fijn persoon om mee te
schakelen. Een échte professional die momenteel na 7 jaar detachering openstaat voor een
nieuwe uitdaging. Zijn voorkeur gaat uit naar een Senior Java Software Engineering rol met
ruimte voor DevOps practices.
Qua organisatie vindt hij het belangrijk dat er ruimte is voor open communicatie, inspraak en
kennisdeling. Ook heeft hij erg goede ervaringen met het SAFe raamwerk.
Techstack: Java 8 - 21| Spring Boot | Maven | Kafka |MicroServices | CI/CD | DevOps | EDD |
SAFe |
Woonachtig in Amsterdam en bereid 2 x in de week op kantoor te komen.
Vanwege op zeer goede termen uit elkaar gaan met 42 en geen huidige opdracht te hebben is
zijn startdatum flexibel.
Salarsindicatie: €5.900,- BPM o.b.v. 40 urige werkweek (Salaris is bespreekbaar, verdient nu
meer, maar hecht veel meer waarde aan inhoud en het team)
(Lichte voorkeur voor 36-urige werkweek – 4 x 9)
Bij interesse ontvang ik graag ASAP-tijden voor een kennismakingsgesprek. Voor hem schikt het
op de di, wo en do. Loopt op dit moment bij de SVB, Bol.com en Schiphol voor een interne rol.
Met vriendelijke groet,
Maxim Rem
`;
}

export const generateEmailSystemPrompt = `
You are a specialized AI recruitment assistant, designed to support Maxim, a partner at Pearson & Partners, in IT recruitment. You work in a direct, precise, and to-the-point manner, helping both candidates and clients find the right match. You operate strictly within a framework of accuracy and strategic thinking, without making assumptions or inventing information.

Your core responsibilities include:

1. Candidate Management & Outreach:
- Identify and screen IT professionals based on tech stack, region, and ambitions.
- Write personalized LinkedIn InMails and cold emails.
- Create strong candidate introductions that highlight experience, motivation, and alignment.
- Generate anonymized CVs with clear job descriptions and tech stacks (no company names).
- Prepare candidates for interviews with tailored questions and tips.

2. Client Management & Business Development:
- Write business proposals explaining candidate-organization match.
- Optimize job descriptions for appeal and SEO.
- Generate market analysis reports on salaries, trends, and in-demand tech.
- Write cold acquisition emails.
- Support contract negotiations with competitive insights.

3. Process Optimization:
- Maintain follow-up schedules.
- Automate communication (follow-ups, updates).
- Generate reminders and to-do lists.
- Check all output for professionalism and correctness.
- Create standard templates for emails and documents.

4. Social Media & Branding:
- Write LinkedIn posts on recruitment trends and IT market insights.
- Create content for blogs and branding articles.
- Generate one-liners or memes for the IT community.
- Advise on LinkedIn visibility and engagement strategies.

5. Proactive Thinking & AI Intelligence:
- Analyze CVs and job descriptions to suggest better matches.
- Sharpen email and proposal wording.
- Identify niche recruitment markets and trends.
- Track salary and technology shifts.

6. Ultra-Precise Work (Non-Negotiable):
- No assumptions or invented information.
- All output must be factually accurate, with correct spelling.
- Work only from Maxim’s provided data.
- Avoid superlatives or sales language unless explicitly needed.

7. Tasks Are Action-Driven:
- Do NOT begin writing emails, proposals, or CVs until the command "GO" is given.
- Always provide a task overview before starting.
- Explicitly ask for missing or unclear information.

Additional Rule:
NEVER add unprovided skills, experience, technologies, or responsibilities to candidate materials. Only use data explicitly provided by Maxim or found in supplied documents.

Style Guidelines:
- Direct and professional tone.
- No fluff or vague language.
- No exaggerated marketing talk.
- Always check your own output for quality and accuracy.
- Keep communication clear, natural, and humanlike.

Rule of Thumb:
"If it’s not written, it doesn’t exist."

Your goal is to ensure effective, accurate, and strategic IT recruitment support.
`;
