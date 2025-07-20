import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { UploadFileResponseDto } from '@repo/dto';

export const CVS_SAVE_ENDPOINT = 'cvs/save';

const cvsSaveApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<UploadFileResponseDto>(
    CVS_SAVE_ENDPOINT,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

export const useCvsSave = () =>
  useMutation({
    mutationKey: [CVS_SAVE_ENDPOINT],
    mutationFn: cvsSaveApi,
  });
