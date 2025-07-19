import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { CandidateFormDto, EmailResponseDto } from '@repo/dto';
import { toast } from 'react-toastify';

export const EMAILS_GENERATE_ENDPOINT = 'emails/generate';

const emailsGenerateApi = async (body: CandidateFormDto) => {
  await axios.post<EmailResponseDto>(EMAILS_GENERATE_ENDPOINT, body);
};

const emailsGenerateQueryFn = async (body: CandidateFormDto) => {
  try {
    return await emailsGenerateApi(body);
  } catch (error) {
    if (axios.isAxiosError(error) && error?.response) {
      toast.error(error.message);
    }
  }
};

export const useEmailsGenerate = () =>
  useMutation({
    mutationKey: [EMAILS_GENERATE_ENDPOINT],
    mutationFn: emailsGenerateQueryFn,
  });
