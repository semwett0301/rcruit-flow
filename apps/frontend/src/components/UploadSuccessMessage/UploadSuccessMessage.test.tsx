/**
 * Unit tests for UploadSuccessMessage component
 * Tests visibility, content rendering, accessibility, and user interactions
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadSuccessMessage from './UploadSuccessMessage';

describe('UploadSuccessMessage', () => {
  const defaultProps = {
    isVisible: true,
    fileName: 'test-file.pdf',
    onDismiss: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders success message when isVisible is true', () => {
      render(<UploadSuccessMessage {...defaultProps} isVisible={true} />);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not render when isVisible is false', () => {
      render(<UploadSuccessMessage {...defaultProps} isVisible={false} />);
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes for visibility when visible', () => {
      render(<UploadSuccessMessage {...defaultProps} isVisible={true} />);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveClass('upload-success-message');
      expect(alertElement).toHaveClass('visible');
    });

    it('applies correct CSS classes when not visible', () => {
      const { container } = render(
        <UploadSuccessMessage {...defaultProps} isVisible={false} />
      );
      
      // Component should not render anything when not visible
      expect(container.firstChild).toBeNull();
    });
  });

  describe('content rendering', () => {
    it('displays correct file name when provided', () => {
      const fileName = 'my-document.pdf';
      render(<UploadSuccessMessage {...defaultProps} fileName={fileName} />);
      
      expect(screen.getByText(fileName)).toBeInTheDocument();
    });

    it('renders next steps list when provided', () => {
      const nextSteps = [
        'Review your uploaded file',
        'Click submit to process',
        'Wait for confirmation',
      ];
      
      render(
        <UploadSuccessMessage {...defaultProps} nextSteps={nextSteps} />
      );
      
      nextSteps.forEach((step) => {
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });

    it('does not render next steps section when not provided', () => {
      render(<UploadSuccessMessage {...defaultProps} />);
      
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('renders next steps as a list with correct items', () => {
      const nextSteps = ['Step 1', 'Step 2'];
      
      render(
        <UploadSuccessMessage {...defaultProps} nextSteps={nextSteps} />
      );
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });
  });

  describe('user interactions', () => {
    it('calls onDismiss when dismiss button clicked', () => {
      const onDismiss = jest.fn();
      render(
        <UploadSuccessMessage {...defaultProps} onDismiss={onDismiss} />
      );
      
      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      fireEvent.click(dismissButton);
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onDismiss is not provided', () => {
      render(
        <UploadSuccessMessage
          isVisible={true}
          fileName="test.pdf"
        />
      );
      
      const dismissButton = screen.queryByRole('button', { name: /dismiss/i });
      if (dismissButton) {
        expect(() => fireEvent.click(dismissButton)).not.toThrow();
      }
    });
  });

  describe('accessibility', () => {
    it('has correct accessibility attributes (aria-live)', () => {
      render(<UploadSuccessMessage {...defaultProps} />);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveAttribute('aria-live', 'polite');
    });

    it('has role="alert" for screen reader announcement', () => {
      render(<UploadSuccessMessage {...defaultProps} />);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('dismiss button is accessible', () => {
      render(<UploadSuccessMessage {...defaultProps} />);
      
      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      expect(dismissButton).toBeInTheDocument();
      expect(dismissButton).toBeEnabled();
    });

    it('has appropriate aria-label on dismiss button', () => {
      render(<UploadSuccessMessage {...defaultProps} />);
      
      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      expect(dismissButton).toHaveAccessibleName();
    });
  });

  describe('edge cases', () => {
    it('handles empty file name gracefully', () => {
      render(
        <UploadSuccessMessage {...defaultProps} fileName="" />
      );
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('handles empty next steps array', () => {
      render(
        <UploadSuccessMessage {...defaultProps} nextSteps={[]} />
      );
      
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('handles undefined next steps', () => {
      render(
        <UploadSuccessMessage {...defaultProps} nextSteps={undefined} />
      );
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
