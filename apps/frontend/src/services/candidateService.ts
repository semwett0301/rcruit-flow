/**
 * Candidate Service
 * 
 * API service methods for candidate-related operations including
 * CRUD operations and email functionality.
 */

import api from './api';

/**
 * Candidate data interface for update operations
 */
export interface UpdateCandidateData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: string;
  notes?: string;
  position?: string;
  skills?: string[];
  experience?: number;
  resumeUrl?: string;
  [key: string]: unknown;
}

/**
 * Email data interface for recruitment email operations
 */
export interface RecruitmentEmailData {
  candidateEmail: string;
  subject?: string;
  body?: string;
  templateId?: string;
  attachments?: string[];
  [key: string]: unknown;
}

/**
 * Candidate response interface
 */
export interface Candidate {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: string;
  notes?: string;
  position?: string;
  skills?: string[];
  experience?: number;
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetches all candidates
 * @returns Promise with array of candidates
 */
export const getCandidates = async (): Promise<Candidate[]> => {
  const response = await api.get('/candidates');
  return response.data;
};

/**
 * Fetches a single candidate by ID
 * @param candidateId - The unique identifier of the candidate
 * @returns Promise with candidate data
 */
export const getCandidate = async (candidateId: string): Promise<Candidate> => {
  const response = await api.get(`/candidates/${candidateId}`);
  return response.data;
};

/**
 * Creates a new candidate
 * @param data - The candidate data to create
 * @returns Promise with created candidate data
 */
export const createCandidate = async (data: UpdateCandidateData): Promise<Candidate> => {
  const response = await api.post('/candidates', data);
  return response.data;
};

/**
 * Updates an existing candidate
 * @param candidateId - The unique identifier of the candidate to update
 * @param data - The candidate data to update, including optional email field
 * @returns Promise with updated candidate data
 */
export const updateCandidate = async (
  candidateId: string,
  data: UpdateCandidateData
): Promise<Candidate> => {
  const response = await api.patch(`/candidates/${candidateId}`, data);
  return response.data;
};

/**
 * Deletes a candidate
 * @param candidateId - The unique identifier of the candidate to delete
 * @returns Promise with deletion confirmation
 */
export const deleteCandidate = async (candidateId: string): Promise<void> => {
  await api.delete(`/candidates/${candidateId}`);
};

/**
 * Sends a recruitment email to a candidate
 * @param candidateId - The unique identifier of the candidate
 * @param emailData - The email data including candidateEmail and other fields
 * @returns Promise with email send confirmation
 */
export const sendRecruitmentEmail = async (
  candidateId: string,
  emailData: RecruitmentEmailData
): Promise<{ success: boolean; messageId?: string }> => {
  const response = await api.post(`/candidates/${candidateId}/send-email`, emailData);
  return response.data;
};

export default {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  sendRecruitmentEmail,
};
