import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { EmailResponse, CandidateForm } from '@repo/dto';

export const EMAILS_GENERATE_ENDPOINT = 'emails/generate';

const emailsGenerateApi = async (body: CandidateForm) => {
  await axios.post<EmailResponse>(EMAILS_GENERATE_ENDPOINT, body);
};

export const useEmailsGenerate = () =>
  useMutation({
    mutationKey: [EMAILS_GENERATE_ENDPOINT],
    mutationFn: emailsGenerateApi,
  });
