/**
 * Unit tests for the EmailGenerationButton component
 *
 * Tests cover:
 * - Default rendering behavior
 * - Custom children rendering
 * - Loading state display and behavior
 * - Click handler functionality
 * - Disabled state behavior
 * - Accessibility attributes
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmailGenerationButton } from './EmailGenerationButton';

describe('EmailGenerationButton', () => {
  it('renders button with default text', () => {
    render(<EmailGenerationButton onClick={() => {}} isLoading={false} />);
    expect(screen.getByRole('button')).toHaveTextContent('Generate Email');
  });

  it('renders custom children', () => {
    render(
      <EmailGenerationButton onClick={() => {}} isLoading={false}>
        Custom Text
      </EmailGenerationButton>
    );
    expect(screen.getByRole('button')).toHaveTextContent('Custom Text');
  });

  it('shows loading state when isLoading is true', () => {
    render(<EmailGenerationButton onClick={() => {}} isLoading={true} />);
    expect(screen.getByRole('button')).toHaveTextContent('Generating...');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked and not loading', () => {
    const handleClick = vi.fn();
    render(<EmailGenerationButton onClick={handleClick} isLoading={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<EmailGenerationButton onClick={handleClick} isLoading={false} disabled />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('has aria-busy attribute when loading', () => {
    render(<EmailGenerationButton onClick={() => {}} isLoading={true} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
