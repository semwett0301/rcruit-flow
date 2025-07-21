import {
  ChangeEvent,
  DragEvent,
  MouseEventHandler,
  ReactNode,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import {
  CheckCircledIcon,
  CrossCircledIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import { Button } from 'ui/Button';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { useCvsSave } from 'queries/api/cvs/cvsSave';

export type UploadState = 'default' | 'success' | 'error';

interface FileUploadProps {
  onFileSelect?: (fileId?: string) => void;
  onFileRemove?: () => void;
  acceptedTypes?: string[];
}

interface StatusDisplayProps {
  icon: ReactNode;
  title: string;
  fileName?: string;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
}

interface StyledUploadAreaProps {
  $state: UploadState;
  $isDragOver: boolean;
}

const UploadContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const UploadArea = styled.div<StyledUploadAreaProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 0.3s ease;

  text-align: center;

  width: 100%;
  height: 100%;

  border-radius: ${({ theme }) => theme.radius.s};
  border: 1px dashed
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.lighterBlue} 40%,
      transparent
    );

  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);

  /* bring in theme and props once */
  ${({ $state, $isDragOver, theme }) => {
    switch ($state) {
      case 'error':
        return css`
          color: ${theme.colors.red};

          background: linear-gradient(
            to bottom right,
            #590c0c99 60%,
            ${theme.colors.red} 70%
          );

          border-color: color-mix(
            in srgb,
            ${theme.colors.red} 40%,
            transparent
          );
        `;

      case 'success':
        return css`
          color: ${theme.colors.green};

          background: linear-gradient(
            to bottom right,
            #0a330799 60%,
            ${theme.colors.green} 70%
          );

          border-color: color-mix(
            in srgb,
            ${theme.colors.green} 40%,
            transparent
          );
        `;

      /* this is the switch‐default, not `case 'default'` */
      default:
        return css`
          color: color-mix(
            in srgb,
            ${theme.colors.lighterBlue} 40%,
            transparent
          );

          background: linear-gradient(
            to bottom right,
            #0a1b4799 60%,
            #1943adb2 70%
          );

          /* drag‐over override */
          ${$isDragOver &&
          css`
            color: ${theme.colors.lighterBlue};
            border-color: ${theme.colors.lighterBlue};
          `};

          /* hover only on pointer devices */
          @media (hover: hover) and (pointer: fine) {
            &:hover {
              color: ${theme.colors.lighterBlue};
              border-color: ${theme.colors.lighterBlue};
            }
          }
        `;
    }
  }};
`;

const DefaultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: ${({ theme }) => theme.spacing.s};
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  gap: 20px;
`;

const StatusTitle = styled.span`
  ${({ theme }) => extractFontPreset('thirdHeading')(theme)}
`;

const StatusFileName = styled.span`
  ${({ theme }) => `
    ${extractFontPreset('regular')(theme)}
    color: ${theme.colors.lighterBlue};
  `}
`;

const HiddenInput = styled.input.attrs({ type: 'file' })`
  clip: rect(0 0 0 0); // Just to be sure

  height: 1px;
  width: 1px;

  padding: 0;
  margin: -1px;

  position: absolute;
`;

const StatusBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
`;

const StatusDisplay = ({
  icon,
  title,
  fileName,
  onDelete,
}: StatusDisplayProps) => {
  return (
    <StatusContainer>
      {icon}
      <StatusBodyContainer>
        <StatusTitle>{title}</StatusTitle>
        {fileName && <StatusFileName>{fileName}</StatusFileName>}
      </StatusBodyContainer>
      <Button onClick={onDelete} style={{ marginTop: 10 }} variant="outline">
        Remove file
      </Button>
    </StatusContainer>
  );
};

export const FileUpload = ({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ['.pdf'],
}: FileUploadProps) => {
  const [uploadState, setUploadState] = useState<UploadState>('default');

  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: saveCv } = useCvsSave();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);

    saveCv(file, {
      onSuccess: (result) => {
        const fileId = result?.key;
        onFileSelect?.(fileId);
        setUploadState('success');
      },
      onError: () => {
        setUploadState('error');
      },
    });
  };

  const handleFileDelete = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);

    onFileRemove?.();

    setUploadState('default');
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
    }
  };

  const getInternalContent = () => {
    switch (uploadState) {
      case 'error':
        return (
          <StatusDisplay
            icon={<CrossCircledIcon width={40} height={40} />}
            title="Incorrect file, check and try again"
            fileName={selectedFile?.name}
            onDelete={handleFileDelete}
          />
        );

      case 'success':
        return (
          <StatusDisplay
            icon={<CheckCircledIcon width={40} height={40} />}
            title="File upload is complete"
            fileName={selectedFile?.name}
            onDelete={handleFileDelete}
          />
        );

      default:
        return (
          <DefaultContainer>
            <UploadIcon width={40} height={40} />
            <span>Drag your resume here (.pdf or .txt) or click to upload</span>
          </DefaultContainer>
        );
    }
  };

  return (
    <UploadContainer>
      <UploadArea
        $state={uploadState}
        $isDragOver={isDragOver}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {getInternalContent()}
      </UploadArea>
      <HiddenInput
        ref={fileInputRef}
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
      />
    </UploadContainer>
  );
};
