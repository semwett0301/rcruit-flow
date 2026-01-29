import type { ExtractCvDataRequest, ExtractCvDataResult } from '@repo/dto';
import { DegreeLevel } from '@repo/dto';

export const extractCvDataRequestFixture: ExtractCvDataRequest = {
  fileId: 'test-cv-file-id-12345',
};

export const extractCvDataResultFixture: ExtractCvDataResult = {
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
};

export const createMockFile = (
  overrides: Partial<Express.Multer.File> = {},
): Express.Multer.File => ({
  fieldname: 'file',
  originalname: 'test-cv.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  buffer: Buffer.from('mock pdf content'),
  size: 1024,
  destination: '',
  filename: 'test-cv.pdf',
  path: '',
  stream: null as never,
  ...overrides,
});
