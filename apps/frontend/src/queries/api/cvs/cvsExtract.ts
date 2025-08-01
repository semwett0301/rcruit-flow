import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ExtractCvDataRequest, ExtractCvDataResult } from '@repo/dto';

export const CVS_EXTRACT_ENDPOINT = 'cvs/extract';

const cvsExctractApi = async (body: ExtractCvDataRequest) => {
  return await axios.post<ExtractCvDataResult>(CVS_EXTRACT_ENDPOINT, body);
};

export const useCvsExtract = () =>
  useMutation({
    mutationKey: [CVS_EXTRACT_ENDPOINT],
    mutationFn: cvsExctractApi,
  });
