import styled, { css } from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';
import { Button, ButtonProps } from 'components/Button';

export type SquareButtonSize = 'xs' | 'l';

export interface SquareButtonProps extends ButtonProps {
  size?: SquareButtonSize;
}

export const baseSquareButton = css`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => extractFontPreset('secondHeading')(theme)};

  padding: 0;
`;

const sizeStyles: Record<SquareButtonSize, ReturnType<typeof css>> = {
  xs: css`
    height: 20px;
    width: 20px;
  `,
  l: css`
    height: 60px;
    width: 60px;
  `,
};

const StyledSquaredButton = styled(Button)<{
  $size: SquareButtonSize;
}>`
  ${baseSquareButton}
  ${({ $size }) => sizeStyles[$size]}
`;

export const SquaredButton = ({
  children,
  size = 'l',
  ...props
}: SquareButtonProps) => (
  <StyledSquaredButton $size={size} disabled={props.disabled} {...props}>
    {children}
  </StyledSquaredButton>
);
