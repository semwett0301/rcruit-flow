import React from 'react';
import styled, { css } from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';

const InputWrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.spacing.xs};
`;

const CustomInput = styled.input<{ $error: boolean }>`
  width: 100%;

  background: transparent;

  ${({ theme }) => extractFontPreset('thirdHeading')(theme)}

  color: ${({ theme }) => theme.colors.white};

  border: 0.5px solid ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.s};
  padding: 20px;

  outline: none;

  &:focus {
    outline: 0.5px solid ${({ theme }) => theme.colors.white};
  }

  &:disabled,
  &::placeholder {
    opacity: 0.4;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  ${({ $error, theme }) =>
    $error &&
    css`
      color: ${theme.colors.red};
      border-color: ${theme.colors.red};

      &::placeholder {
        color: ${theme.colors.red};
        opacity: 0.4;
      }

      &:focus {
        outline-color: ${theme.colors.red};
      }
    `}
`;

const ErrorMessage = styled.div`
  ${({ theme }) => css`
    ${extractFontPreset('regular')(theme)}
    color: ${theme.colors.red};
  `}
`;

const RightIconWrapper = styled.div`
  position: absolute;
  cursor: pointer;

  ${({ theme }) => css`
    width: ${theme.spacing.s};
    height: ${theme.spacing.s};

    top: calc(50% - 10px);

    right: ${theme.spacing.s};
    color: ${theme.colors.white};
  `}
`;

type CurrentInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  rightIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, CurrentInputProps>(
  ({ error, rightIcon, ...props }, ref) => {
    return (
      <InputWrapper>
        <CustomInput $error={!!error} ref={ref} {...props} />
        {rightIcon && <RightIconWrapper>{rightIcon}</RightIconWrapper>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputWrapper>
    );
  },
);

Input.displayName = 'Input';
