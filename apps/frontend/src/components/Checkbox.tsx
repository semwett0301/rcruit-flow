import React from 'react';
import styled, { css } from 'styled-components';
import { CheckIcon } from '@radix-ui/react-icons';
import { extractFontPreset } from 'theme/utils/extractFontPreset';

export interface CheckboxProps {
  checked?: boolean;
  label?: string;
  onCheck?: (isChecked: boolean) => void;
}

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  clip: rect(0 0 0 0); // Just to be sure

  height: 1px;
  width: 1px;

  padding: 0;
  margin: -1px;

  position: absolute;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;

  cursor: pointer;

  color: ${({ theme }) => theme.colors.lighterBlue};

  position: relative;
`;

const StyledCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;

  transition: all 0.2s ease;

  background: transparent;

  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);

  ${({ theme }) => css`
    border: 1px solid ${theme.colors.lighterBlue};
    border-radius: ${theme.radius.xs};
  `}
`;

const LabelText = styled.span`
  margin-left: ${({ theme }) => theme.spacing.xs};

  ${({ theme }) => extractFontPreset('thirdHeading')(theme)}
`;

export const Checkbox = ({
  checked = false,
  onCheck,
  label,
}: CheckboxProps) => {
  return (
    <CheckboxContainer>
      <HiddenCheckbox
        checked={checked}
        onChange={(e) => onCheck?.(e.target.checked)}
      />
      <StyledCheckbox>
        {checked && <CheckIcon width={16} height={16} />}
      </StyledCheckbox>
      {label && <LabelText>{label}</LabelText>}
    </CheckboxContainer>
  );
};
