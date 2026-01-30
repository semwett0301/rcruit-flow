/**
 * Candidate Service
 * 
 * Provides API methods for managing candidates including
 * saving, updating emails, and sending recruitment emails.
 */

import api from './api';

/**
 * Represents a candidate entity returned from the API
 */
export interface Candidate {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for saving a new candidate
 */
export interface SaveCandidateRequest {
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  notes?: string;
}

/**
 * Request payload for sending a recruitment email
 */
export interface SendRecruitmentEmailRequest {
  candidateId: string;
  /** Email address to send to - allows override of candidate's stored email */
  email: string;
  templateId?: string;
  subject?: string;
  body?: string;
}

/**
 * Saves a new candidate to the system
 * 
 * @param data - The candidate data to save
 * @returns The created candidate
 */
export const saveCandidate = async (data: SaveCandidateRequest): Promise<Candidate> => {
  const response = await api.post('/candidates', data);
  return response.data;
};

/**
 * Updates a candidate's email address
 * 
 * @param candidateId - The ID of the candidate to update
 * @param email - The new email address
 * @returns The updated candidate
 */
export const updateCandidateEmail = async (
  candidateId: string,
  email: string
): Promise<Candidate> => {
  const response = await api.patch(`/candidates/${candidateId}/email`, { email });
  return response.data;
};

/**
 * Sends a recruitment email to a candidate
 * 
 * @param data - The email request data including candidate ID and email override
 */
export const sendRecruitmentEmail = async (
  data: SendRecruitmentEmailRequest
): Promise<void> => {
  await api.post('/recruitment-emails/send', data);
};
