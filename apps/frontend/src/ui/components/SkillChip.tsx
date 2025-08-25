import React from 'react';
import styled, { css } from 'styled-components';
import { Cross2Icon } from '@radix-ui/react-icons';
import { extractFontPreset } from 'theme/utils/extractFontPreset';

const Chip = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: transparent;

  ${({ theme }) => css`
    border: 1px solid ${theme.colors.white};
    border-radius: ${theme.radius.s};

    color: ${theme.colors.white};

    padding: ${theme.spacing.xs} ${theme.spacing.s};
  `}
`;

const ChipText = styled.span`
  ${({ theme }) => css`
    margin-right: ${theme.spacing.xs};
    ${extractFontPreset('thirdHeading')(theme)}
  `}
`;

const RemoveButton = styled.button`
  width: 20px;
  height: 20px;

  cursor: pointer;

  background-color: transparent;
  border: none;

  color: inherit;
`;

interface SkillChipProps {
  value: string;
  onRemove?: () => void;
}

export const SkillChip: React.FC<SkillChipProps> = ({ value, onRemove }) => {
  return (
    <Chip>
      <ChipText>{value}</ChipText>
      {onRemove && (
        <RemoveButton onClick={onRemove} aria-label={`Remove ${value}`}>
          <Cross2Icon width={20} height={20} />
        </RemoveButton>
      )}
    </Chip>
  );
};
