import type { CandidateForm, EmailResponse, TravelOption } from '@repo/dto';
import { DegreeLevel, SalaryPeriod, TravelModeEnum } from '@repo/dto';

export const travelOptionsFixture: TravelOption[] = [
  {
    travelMode: TravelModeEnum.CAR,
    minutesOfRoad: 30,
    onSiteDays: 3,
  },
  {
    travelMode: TravelModeEnum.REMOTE,
    onSiteDays: 2,
  },
];

export const candidateFormFixture: CandidateForm = {
  candidateName: 'Jane Smith',
  currentEmployer: 'Tech Company',
  currentPosition: 'Senior Developer',
  age: 30,
  location: 'Amsterdam, Netherlands',
  hardSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
  experienceDescription:
    'Experienced full-stack developer with 5+ years in web development',
  yearsOfExperience: 5,
  degrees: [
    {
      level: DegreeLevel.MASTER,
      program: 'Computer Science',
    },
  ],
  recruiterName: 'Recruiter John',
  contactName: 'HR Manager',
  focusRoles: ['Full-stack Developer', 'Backend Developer'],
  ambitions: 'Looking to lead a team in the future',
  travelOptions: travelOptionsFixture,
  grossSalary: 75000,
  salaryPeriod: SalaryPeriod.YEAR,
  hoursAWeek: 40,
};

export const emailResponseFixture: EmailResponse = {
  email: `Dear HR Manager,

I am pleased to introduce Jane Smith for the Full-stack Developer position.

Best regards,
Recruiter John`,
};
