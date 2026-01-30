/**
 * Unit tests for SuccessMessage component
 *
 * Tests cover:
 * - Visibility behavior (renders nothing when hidden, renders content when visible)
 * - Content display (title, message, nextSteps)
 * - User interactions (dismiss button)
 * - Accessibility attributes (role, aria-live)
 * - CSS class application for styling
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SuccessMessage } from '../SuccessMessage';

describe('SuccessMessage', () => {
  const defaultProps = {
    visible: true,
    title: 'Success!',
    message: 'Your action was completed successfully.',
    nextSteps: ['Step 1', 'Step 2', 'Step 3'],
    onDismiss: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders nothing when visible=false', () => {
      const { container } = render(
        <SuccessMessage {...defaultProps} visible={false} />
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('renders message when visible=true', () => {
      render(<SuccessMessage {...defaultProps} visible={true} />);

      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
    });
  });

  describe('content display', () => {
    it('displays title correctly', () => {
      render(<SuccessMessage {...defaultProps} />);

      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });

    it('displays message correctly', () => {
      render(<SuccessMessage {...defaultProps} />);

      expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
    });

    it('displays nextSteps correctly', () => {
      render(<SuccessMessage {...defaultProps} />);

      defaultProps.nextSteps.forEach((step) => {
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });

    it('renders without nextSteps when not provided', () => {
      const propsWithoutSteps = {
        ...defaultProps,
        nextSteps: undefined,
      };

      render(<SuccessMessage {...propsWithoutSteps} />);

      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
    });

    it('renders with empty nextSteps array', () => {
      const propsWithEmptySteps = {
        ...defaultProps,
        nextSteps: [],
      };

      render(<SuccessMessage {...propsWithEmptySteps} />);

      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onDismiss when dismiss button is clicked', () => {
      const onDismiss = jest.fn();
      render(<SuccessMessage {...defaultProps} onDismiss={onDismiss} />);

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      fireEvent.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onDismiss is not provided', () => {
      const propsWithoutDismiss = {
        ...defaultProps,
        onDismiss: undefined,
      };

      render(<SuccessMessage {...propsWithoutDismiss} />);

      // Should render without errors even if dismiss handler is optional
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has role="alert" for screen reader announcement', () => {
      render(<SuccessMessage {...defaultProps} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has aria-live="polite" for non-intrusive announcements', () => {
      render(<SuccessMessage {...defaultProps} />);

      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveAttribute('aria-live', 'polite');
    });

    it('dismiss button is accessible', () => {
      render(<SuccessMessage {...defaultProps} />);

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      expect(dismissButton).toBeInTheDocument();
      expect(dismissButton).toBeEnabled();
    });
  });

  describe('styling', () => {
    it('applies correct CSS classes for success styling', () => {
      render(<SuccessMessage {...defaultProps} />);

      const alertElement = screen.getByRole('alert');
      // Check for success-related class names
      expect(alertElement).toHaveClass('success-message');
    });

    it('applies container class for layout', () => {
      const { container } = render(<SuccessMessage {...defaultProps} />);

      // The component should have a container with appropriate styling class
      const successContainer = container.querySelector('.success-message');
      expect(successContainer).toBeInTheDocument();
    });
  });
});
