import React, { useState } from 'react';
import styled from 'styled-components';
import { FileUpload, UploadState } from 'ui/FileUpload';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { useCvsSave } from 'queries/api/cvs/cvsSave';

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  gap: ${({ theme }) => theme.spacing.m};

  color: ${({ theme }) => theme.colors.white};
`;

const TopBar = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: ${({ theme }) => theme.spacing.m};
`;

const InfoText = styled.div`
  max-width: 500px;

  ${({ theme }) => extractFontPreset('regular')(theme)}

  text-align: left;
`;

const InfoIconWrapper = styled.div`
  cursor: pointer;
`;

interface CvUploadFormProps {
  onSubmit?: (state: CvUploadFormState | null) => void;
  defaultValue?: CvUploadFormState;
}

export type CvUploadFormState = {
  fileId: string;
  file: File;
};

export const CvUploadForm = ({ onSubmit, defaultValue }: CvUploadFormProps) => {
  const { mutate: saveCv } = useCvsSave();

  const [uploadState, setUploadState] = useState<UploadState>(
    defaultValue ? 'success' : 'default',
  );

  const onFileSelect = (file: File) => {
    saveCv(file, {
      onSuccess: (result) => {
        onSubmit?.({
          fileId: result.key,
          file,
        });

        setUploadState('success');
      },
      onError: () => {
        setUploadState('error');
      },
    });
  };

  const onFileRemove = () => {
    setUploadState('default');
    onSubmit?.(null);
  };

  return (
    <FormWrapper>
      <TopBar>
        <InfoText>
          To upload your CV, simply click the 'Upload' button and select your
          file from your device. Ensure your document is in PDF format for a
          smooth submission process.
        </InfoText>
        <InfoIconWrapper>
          <InfoCircledIcon width={24} height={24} />
        </InfoIconWrapper>
      </TopBar>
      <FileUpload
        uploadState={uploadState}
        onFileRemove={onFileRemove}
        onFileSelect={onFileSelect}
        defaultFile={defaultValue?.file}
      />
    </FormWrapper>
  );
};
