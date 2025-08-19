import { Degree } from './degree.dto';

export interface ExtractCvDataResult {
  candidateName: string;
  currentEmployer?: string;
  currentPosition?: string;
  age: number;
  location: string;
  hardSkills: string[];
  experienceDescription: string;
  yearsOfExperience: number;
  degrees: Degree[];
}
