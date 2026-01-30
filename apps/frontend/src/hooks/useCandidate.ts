import { useCallback } from 'react';
import api from '../api';

/**
 * Parameters for updating a candidate
 */
export interface UpdateCandidateParams {
  /** Candidate ID (required for updates) */
  id?: string;
  /** Candidate email address */
  email: string;
  /** Candidate first name */
  firstName?: string;
  /** Candidate last name */
  lastName?: string;
  /** Candidate phone number */
  phone?: string;
  /** Additional candidate data */
  [key: string]: unknown;
}

/**
 * Response from candidate API operations
 */
export interface CandidateResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Response from send email operation
 */
export interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Hook for managing candidate operations including updates and email sending
 * 
 * @returns Object containing candidate operation functions
 * 
 * @example
 * ```tsx
 * const { updateCandidate, sendRecruitmentEmail } = useCandidate();
 * 
 * // Update candidate email
 * await updateCandidate({ id: '123', email: 'new@email.com' });
 * 
 * // Send recruitment email
 * await sendRecruitmentEmail('123', 'candidate@email.com');
 * ```
 */
export const useCandidate = () => {
  /**
   * Updates a candidate's information including email
   * 
   * @param params - The update parameters containing candidate data
   * @returns Promise resolving to the updated candidate data
   * @throws Error if candidate ID is not provided or API call fails
   */
  const updateCandidate = useCallback(async (params: UpdateCandidateParams): Promise<CandidateResponse> => {
    if (!params.id) {
      throw new Error('Candidate ID is required for updates');
    }

    const { id, ...updateData } = params;
    
    const response = await api.patch<CandidateResponse>(`/candidates/${id}`, {
      email: updateData.email,
      ...(updateData.firstName && { firstName: updateData.firstName }),
      ...(updateData.lastName && { lastName: updateData.lastName }),
      ...(updateData.phone && { phone: updateData.phone }),
    });
    
    return response.data;
  }, []);

  /**
   * Sends a recruitment email to a candidate
   * Uses the provided email address which may be an edited/updated email
   * 
   * @param candidateId - The ID of the candidate
   * @param email - The email address to send to (may be edited by user)
   * @returns Promise resolving to the send email response
   * @throws Error if candidateId or email is not provided or API call fails
   */
  const sendRecruitmentEmail = useCallback(async (
    candidateId: string,
    email: string
  ): Promise<SendEmailResponse> => {
    if (!candidateId) {
      throw new Error('Candidate ID is required');
    }
    
    if (!email) {
      throw new Error('Email address is required');
    }

    const response = await api.post<SendEmailResponse>(`/candidates/${candidateId}/send-email`, {
      email,
    });
    
    return response.data;
  }, []);

  /**
   * Saves candidate data and optionally sends a recruitment email
   * Combines update and send operations for convenience
   * 
   * @param params - The candidate update parameters
   * @param sendEmail - Whether to send a recruitment email after saving
   * @returns Promise resolving to the updated candidate and optional email response
   */
  const saveAndSend = useCallback(async (
    params: UpdateCandidateParams,
    sendEmail: boolean = false
  ): Promise<{ candidate: CandidateResponse; emailResponse?: SendEmailResponse }> => {
    const candidate = await updateCandidate(params);
    
    let emailResponse: SendEmailResponse | undefined;
    if (sendEmail && params.id) {
      emailResponse = await sendRecruitmentEmail(params.id, params.email);
    }
    
    return { candidate, emailResponse };
  }, [updateCandidate, sendRecruitmentEmail]);

  return {
    updateCandidate,
    sendRecruitmentEmail,
    saveAndSend,
  };
};

export default useCandidate;
