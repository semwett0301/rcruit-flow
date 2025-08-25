import styled, { css } from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';

interface FormColProps {
  $width?: number;
  $gap?: number;
}

export const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => extractFontPreset('secondHeading')(theme)};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

export const Label = styled.label`
  display: block;

  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => extractFontPreset('regularBold')(theme)};
`;

export const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

export const FormCol = styled.div<FormColProps>`
  display: flex;
  flex-direction: column;

  ${({ $width }) =>
    $width !== undefined
      ? css`
          flex: 0 0 auto;
          width: min(${$width}px, 100%);
        `
      : css`
          flex: 1 1 0;
          width: 100%;
        `};

  ${({ $gap }) =>
    !!$gap &&
    css`
      gap: ${$gap}px;
    `}
`;
