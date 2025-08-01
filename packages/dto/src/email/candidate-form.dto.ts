import { SalaryPeriod, TravelModeEnum } from '../enum';
import { ExtractCvDataResult } from '../cv/exctract-cv-data-result.dto';

export interface CandidateForm extends ExtractCvDataResult {
  employmentStatus: boolean;
  recruiterName: string;
  contactName: string;
  graduationStatus: boolean;

  targetRoles: string[];
  ambitions?: string;

  travelMode?: TravelModeEnum;
  minutesOfRoad?: number[];
  onSiteDays?: number[];

  grossSalary: number;
  salaryPeriod: SalaryPeriod;
  hoursAWeek: 8 | 16 | 24 | 32 | 40;

  jobDescriptionText?: string;
  jobDescriptionFile?: Express.Multer.File;
}
