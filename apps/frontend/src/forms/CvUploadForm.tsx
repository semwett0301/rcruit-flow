import React from 'react';
import styled from 'styled-components';
import { FileUpload, FileUploadState, useFileUpload } from 'ui/FileUpload';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { CvUploadTooltip } from 'widgets/CvUploadTooltip';

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

  transition: color 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: color-mix(
        in srgb,
        ${({ theme }) => theme.colors.lighterBlue} 40%,
        transparent
      );
    }
  }
`;

interface CvUploadFormProps {
  onSubmit?: (state: FileUploadState | null) => void;
  defaultValue?: FileUploadState;
}

export const CvUploadForm = ({ onSubmit, defaultValue }: CvUploadFormProps) => {
  const { uploadState, onFileSelect, onFileRemove } = useFileUpload({
    initialValue: defaultValue,
    onUploaded: onSubmit,
  });

  return (
    <FormWrapper>
      <TopBar>
        <InfoText>
          To upload your CV, simply click the 'Upload' button and select your
          file from your device. Ensure your document is in PDF format for a
          smooth submission process.
        </InfoText>
        <CvUploadTooltip>
          <InfoIconWrapper>
            <InfoCircledIcon width={24} height={24} />
          </InfoIconWrapper>
        </CvUploadTooltip>
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
