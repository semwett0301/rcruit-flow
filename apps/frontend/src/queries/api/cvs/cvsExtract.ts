import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ExtractCvDataDto, ExtractCvDataResultDto } from '@repo/dto';
import { toast } from 'react-toastify';

export const CVS_EXTRACT_ENDPOINT = 'cvs/extract';

const cvsExctractApi = async (body: ExtractCvDataDto) => {
  await axios.post<ExtractCvDataResultDto>(CVS_EXTRACT_ENDPOINT, body);
};

const cvsExtractQueryFn = async (body: ExtractCvDataDto) => {
  try {
    return await cvsExctractApi(body);
  } catch (error) {
    if (axios.isAxiosError(error) && error?.response) {
      toast.error(error.message);
    }
  }
};

export const useCvsExtract = () =>
  useMutation({
    mutationKey: [CVS_EXTRACT_ENDPOINT],
    mutationFn: cvsExtractQueryFn,
  });
