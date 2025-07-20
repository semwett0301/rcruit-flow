import styled, { css } from 'styled-components';
import { extractFontPreset } from 'theme/utils/extractFontPreset';

export type ButtonVariant = 'primary' | 'outline' | 'disabled';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const baseButton = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: ${({ theme }) => theme.spacing.xs};
  ${({ theme }) => extractFontPreset('button')(theme)}

  border-radius: ${({ theme }) => theme.radius.s};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.s}`};

  height: 40px;

  cursor: pointer;

  border: 1px solid ${({ theme }) => theme.colors.white};

  color: ${({ theme }) => theme.colors.white};
`;

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.brightBlue};

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: ${({ theme }) => theme.colors.darkerBlue};
      }
    }

    &:active {
      background: linear-gradient(
        to bottom,
        rgba(10, 27, 71, 0.6),
        rgba(25, 67, 173, 0.7)
      );
    }
  `,
  outline: css`
    background-color: transparent;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: ${({ theme }) => theme.colors.blackBlue};
        background-color: ${({ theme }) => theme.colors.white};
      }
    }

    &:active {
      color: ${({ theme }) => theme.colors.backgroundBlue};
      background-color: ${({ theme }) => theme.colors.lighterBlue};
    }
  `,
  disabled: css`
    cursor: not-allowed;

    background: linear-gradient(
      to bottom,
      rgba(10, 27, 71, 0.6),
      rgba(25, 67, 173, 0.7)
    );

    color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.white} 60%,
      transparent
    );
  `,
};

const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  ${baseButton}
  ${({ $variant }) => variantStyles[$variant]}
`;

export const Button = ({
  children,
  variant = 'primary',
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) => (
  <StyledButton
    $variant={props.disabled ? 'disabled' : variant}
    disabled={props.disabled}
    {...props}
  >
    {leftIcon && leftIcon}
    {children}
    {rightIcon && rightIcon}
  </StyledButton>
);
