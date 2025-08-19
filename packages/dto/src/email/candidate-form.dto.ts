import { SalaryPeriod, TravelModeEnum } from '../enum';
import { ExtractCvDataResult } from '../cv/exctract-cv-data-result.dto';
import { WeekHours } from '../enum/weekHours';

export interface CandidateForm extends ExtractCvDataResult {
  recruiterName: string;
  contactName: string;

  focusRoles: string[];
  ambitions?: string;

  travelMode?: TravelModeEnum;
  minutesOfRoad?: number;
  onSiteDays?: number;

  grossSalary: number;
  salaryPeriod: SalaryPeriod;
  hoursAWeek: WeekHours;

  jobDescriptionText?: string;
  jobDescriptionFile?: string;
}
