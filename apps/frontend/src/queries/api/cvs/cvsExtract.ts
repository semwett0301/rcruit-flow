import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ExtractCvDataDto, ExtractCvDataResultDto } from '@repo/dto';

export const CVS_EXTRACT_ENDPOINT = 'cvs/extract';

const cvsExctractApi = async (body: ExtractCvDataDto) => {
  await axios.post<ExtractCvDataResultDto>(CVS_EXTRACT_ENDPOINT, body);
};

export const useCvsExtract = () =>
  useMutation({
    mutationKey: [CVS_EXTRACT_ENDPOINT],
    mutationFn: cvsExctractApi,
  });
