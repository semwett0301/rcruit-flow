/**
 * Unit tests for the SuccessMessage component
 * Tests rendering, visibility, accessibility, and user interactions
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { SuccessMessage } from '../SuccessMessage';

describe('SuccessMessage', () => {
  const defaultProps = {
    title: 'Success!',
    message: 'Your action was completed successfully.',
    visible: true,
  };

  describe('visibility', () => {
    it('renders title and message when visible is true', () => {
      render(<SuccessMessage {...defaultProps} />);

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Your action was completed successfully.')).toBeInTheDocument();
    });

    it('does not render when visible is false', () => {
      render(<SuccessMessage {...defaultProps} visible={false} />);

      expect(screen.queryByText('Success!')).not.toBeInTheDocument();
      expect(screen.queryByText('Your action was completed successfully.')).not.toBeInTheDocument();
    });
  });

  describe('next steps', () => {
    it('displays next steps when provided', () => {
      const nextSteps = ['Step 1: Review your changes', 'Step 2: Share with team'];
      render(<SuccessMessage {...defaultProps} nextSteps={nextSteps} />);

      expect(screen.getByText('Step 1: Review your changes')).toBeInTheDocument();
      expect(screen.getByText('Step 2: Share with team')).toBeInTheDocument();
    });

    it('does not render next steps section when not provided', () => {
      render(<SuccessMessage {...defaultProps} />);

      // Assuming next steps would be in a list or specific container
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('does not render next steps section when empty array provided', () => {
      render(<SuccessMessage {...defaultProps} nextSteps={[]} />);

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  describe('dismiss functionality', () => {
    it('calls onDismiss when dismiss button clicked', () => {
      const onDismiss = jest.fn();
      render(<SuccessMessage {...defaultProps} onDismiss={onDismiss} />);

      const dismissButton = screen.getByRole('button', { name: /dismiss|close/i });
      fireEvent.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not render dismiss button when onDismiss is not provided', () => {
      render(<SuccessMessage {...defaultProps} />);

      expect(screen.queryByRole('button', { name: /dismiss|close/i })).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has correct aria attributes for accessibility', () => {
      render(<SuccessMessage {...defaultProps} />);

      // Success messages should have role="alert" or role="status" for screen readers
      const alertElement = screen.getByRole('alert') || screen.getByRole('status');
      expect(alertElement).toBeInTheDocument();
    });

    it('has aria-live attribute for dynamic content announcement', () => {
      render(<SuccessMessage {...defaultProps} />);

      const container = screen.getByRole('alert') || screen.getByRole('status');
      expect(container).toHaveAttribute('aria-live');
    });

    it('dismiss button has accessible name', () => {
      const onDismiss = jest.fn();
      render(<SuccessMessage {...defaultProps} onDismiss={onDismiss} />);

      const dismissButton = screen.getByRole('button', { name: /dismiss|close/i });
      expect(dismissButton).toHaveAccessibleName();
    });
  });

  describe('CSS classes', () => {
    it('applies correct CSS classes', () => {
      const { container } = render(<SuccessMessage {...defaultProps} />);

      // Check for success-related class names
      const successElement = container.querySelector('.success-message') ||
                            container.querySelector('[class*="success"]');
      expect(successElement).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <SuccessMessage {...defaultProps} className="custom-class" />
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });
});
