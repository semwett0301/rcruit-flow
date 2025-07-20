import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { CandidateFormDto, EmailResponseDto } from '@repo/dto';

export const EMAILS_GENERATE_ENDPOINT = 'emails/generate';

const emailsGenerateApi = async (body: CandidateFormDto) => {
  await axios.post<EmailResponseDto>(EMAILS_GENERATE_ENDPOINT, body);
};

export const useEmailsGenerate = () =>
  useMutation({
    mutationKey: [EMAILS_GENERATE_ENDPOINT],
    mutationFn: emailsGenerateApi,
  });
