import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
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

const cvsSaveQueryFn = async (file: File) => {
  try {
    return await cvsSaveApi(file);
  } catch (error) {
    if (axios.isAxiosError(error) && error?.response) {
      toast.error(error.message);
    }
  }
};

export const useCvsSave = () =>
  useMutation({
    mutationKey: [CVS_SAVE_ENDPOINT],
    mutationFn: cvsSaveQueryFn,
  });
