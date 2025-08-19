import React from 'react';
import styled, { css } from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  height: 100%;
`;

const CustomTextarea = styled.textarea<{
  $error: boolean;
  $height?: number | string;
}>`
  width: 100%;
  background: transparent;

  ${({ theme }) => extractFontPreset('thirdHeading')(theme)}

  color: ${({ theme }) => theme.colors.white};

  border: 0.5px solid ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.s};
  padding: 20px;

  outline: none;
  resize: none;

  height: ${({ $height }) => ($height ? `${$height}px` : '200px')};

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

type CurrentTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: string;
    height?: number | string;
  };

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  CurrentTextareaProps
>(({ error, height, ...props }, ref) => {
  return (
    <TextareaWrapper>
      <CustomTextarea $height={height} $error={!!error} ref={ref} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </TextareaWrapper>
  );
});

Textarea.displayName = 'Textarea';
