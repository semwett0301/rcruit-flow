/**
 * CTAButton Component
 *
 * A reusable Call-to-Action button component with enhanced visual styling.
 * Supports various states including disabled, and allows for custom styling
 * through className prop.
 */

import React from 'react';

/**
 * Props interface for the CTAButton component
 */
interface CTAButtonProps {
  /** Content to be rendered inside the button */
  children: React.ReactNode;
  /** Click handler function */
  onClick?: () => void;
  /** Button type attribute - defaults to 'button' */
  type?: 'button' | 'submit';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS classes to apply */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

/**
 * CTAButton - A styled call-to-action button component
 *
 * @example
 * ```tsx
 * <CTAButton onClick={handleClick}>Get Started</CTAButton>
 * ```
 *
 * @example
 * ```tsx
 * <CTAButton type="submit" disabled={isLoading}>
 *   Submit Form
 * </CTAButton>
 * ```
 */
export const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ariaLabel,
}) => {
  const baseStyles = 'cta-button-primary';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const combinedClassName = `${baseStyles} ${className} ${disabledStyles}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={combinedClassName}
    >
      {children}
    </button>
  );
};

export default CTAButton;
