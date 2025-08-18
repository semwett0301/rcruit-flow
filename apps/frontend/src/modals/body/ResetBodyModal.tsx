import styled, { css } from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { remove } from '@ebay/nice-modal-react';
import { ExclamationTriangleIcon, LoopIcon } from '@radix-ui/react-icons';
import { Button } from 'ui/Button';
import { SimpleModal } from 'modals/SimpleModal';

interface ResetBodyModalProps {
  onReset: () => void;
}

const BodyModal = styled.div`
  display: flex;
  flex-direction: column;

  width: 340px;

  gap: ${({ theme }) => theme.spacing.l};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    gap: ${theme.spacing.s};

    color: ${theme.colors.white};
  `}
`;

const AlertContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: ${({ theme }) => theme.spacing.s};
`;

const ResetHeader = styled.h1`
  width: 270px;
  ${({ theme }) => extractFontPreset('secondHeading')(theme)}
`;

const ResetText = styled.p`
  ${({ theme }) => extractFontPreset('regular')(theme)}
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
`;

export const ResetBodyModal = ({ onReset }: ResetBodyModalProps) => {
  const onContinue = () => {
    remove(SimpleModal);
  };

  const resetFunction = () => {
    onReset?.();
    onContinue();
  };

  return (
    <BodyModal>
      <TitleContainer>
        <AlertContainer>
          <ExclamationTriangleIcon width={50} height={50} />
          <ResetHeader>Are you sure you want to start over?</ResetHeader>
        </AlertContainer>
        <ResetText>
          Please be aware that proceeding will result in the file being reset
          and all data will be permanently deleted.
        </ResetText>
      </TitleContainer>
      <ButtonContainer>
        <Button
          fullWidth
          onClick={resetFunction}
          type="reset"
          variant="outline"
        >
          Reset <LoopIcon width={20} height={20} />
        </Button>
        <Button fullWidth onClick={onContinue}>
          Continue
        </Button>
      </ButtonContainer>
    </BodyModal>
  );
};
