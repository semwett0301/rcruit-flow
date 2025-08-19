import React from 'react';
import styled, { css } from 'styled-components';
import { SwitchProps } from 'types/ui/SwitchOption';
import { extractFontPreset } from 'theme/utils/extractFontPreset';

const SwitchWrapper = styled.div`
  display: flex;
  gap: 20px;

  width: 100%;

  user-select: none;

  padding: 9px;

  background: transparent;

  border-radius: ${({ theme }) => theme.radius.s};
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.lighterBlue} 40%,
      transparent
    );
`;

const OptionButton = styled.button<{ $active: boolean }>`
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  height: 38px;

  background: transparent;
  color: ${({ theme }) => theme.colors.lighterBlue};

  border: none;
  border-radius: ${({ theme }) => theme.radius.xs};

  ${({ theme }) => extractFontPreset('thirdHeading')(theme)}

  cursor: pointer;

  transition: color 0.2s ease;

  ${({ $active, theme }) =>
    $active &&
    css`
      border: 1px solid ${theme.colors.lighterBlue};
      ${extractFontPreset('button')(theme)}
    `}
`;

export function TextSwitch({ options, value, onSwitch, ...rest }: SwitchProps) {
  const [firstOption, secondOption] = options;
  const isFirstOption = value === firstOption.value;

  return (
    <SwitchWrapper {...rest}>
      <OptionButton
        type="button"
        $active={isFirstOption}
        onClick={() => onSwitch?.(firstOption.value)}
      >
        {firstOption.label}
      </OptionButton>
      <OptionButton
        type="button"
        $active={!isFirstOption}
        onClick={() => onSwitch?.(secondOption.value)}
      >
        {secondOption.label}
      </OptionButton>
    </SwitchWrapper>
  );
}
