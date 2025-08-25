import React from 'react';
import styled, { css } from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';

type ErrorProps = {
  $error: boolean;
};

const InputWrapper = styled.div<ErrorProps>`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.spacing.xs};

  ${({ $error, theme }) => css`
    color: ${$error ? theme.colors.red : theme.colors.white};
  `}
`;

const CustomInput = styled.input`
  width: 100%;

  background: transparent;

  ${({ theme }) => extractFontPreset('thirdHeading')(theme)}

  border: 0.5px solid currentColor;

  border-radius: ${({ theme }) => theme.radius.s};
  padding: 20px;

  outline: none;
  color: inherit;

  &:focus {
    outline: 0.5px solid currentColor;
  }

  &:disabled,
  &::placeholder {
    color: inherit;
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
`;

const InputIconWrapper = styled.div`
  position: relative;
`;

const ErrorMessage = styled.div`
  ${({ theme }) => css`
    ${extractFontPreset('regular')(theme)}
  `}
`;

const RightIconWrapper = styled.div`
  position: absolute;
  cursor: pointer;
  user-select: none;

  ${({ theme }) => css`
    width: ${theme.spacing.s};
    height: ${theme.spacing.s};

    top: calc(50% - 10px);

    right: ${theme.spacing.s};
  `}
  &:hover {
    opacity: 0.5;
  }
`;

type CurrentInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  rightIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, CurrentInputProps>(
  ({ error, rightIcon, ...props }, ref) => {
    return (
      <InputWrapper $error={!!error}>
        <InputIconWrapper>
          <CustomInput ref={ref} {...props} />
          {rightIcon && <RightIconWrapper>{rightIcon}</RightIconWrapper>}
        </InputIconWrapper>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputWrapper>
    );
  },
);

Input.displayName = 'Input';
