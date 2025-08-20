import { SalaryPeriod, TravelModeEnum } from '../enum';
import { ExtractCvDataResult } from '../cv/exctract-cv-data-result.dto';
import { WeekHours } from '../enum/weekHours';

export interface CandidateForm extends ExtractCvDataResult {
  recruiterName: string;
  contactName: string;

  focusRoles: string[];
  ambitions?: string;

  travelOptions: TravelOption[];

  grossSalary: number;
  salaryPeriod: SalaryPeriod;
  hoursAWeek: WeekHours;

  jobDescriptionText?: string;
  jobDescriptionFile?: string;
}

export interface TravelOption {
  travelMode: TravelModeEnum;
  minutesOfRoad?: number;
  onSiteDays?: number;
}
