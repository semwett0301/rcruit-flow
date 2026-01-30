/**
 * Unit tests for the CTAButton component
 * Tests rendering, styling, interactions, and accessibility features
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CTAButton } from './CTAButton';

describe('CTAButton', () => {
  it('renders children correctly', () => {
    render(<CTAButton>Click Me</CTAButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies cta-button-primary class', () => {
    render(<CTAButton>Test</CTAButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('cta-button-primary');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<CTAButton onClick={handleClick}>Click</CTAButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<CTAButton disabled>Disabled</CTAButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <CTAButton onClick={handleClick} disabled>
        Disabled
      </CTAButton>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<CTAButton className="custom-class">Test</CTAButton>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('preserves default class when custom className is provided', () => {
    render(<CTAButton className="custom-class">Test</CTAButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('cta-button-primary');
    expect(button).toHaveClass('custom-class');
  });

  it('has correct aria-label when provided', () => {
    render(<CTAButton ariaLabel="Start action">Start</CTAButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Start action');
  });

  it('renders without aria-label when not provided', () => {
    render(<CTAButton>Test</CTAButton>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-label');
  });

  it('renders as a button element', () => {
    render(<CTAButton>Test</CTAButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
