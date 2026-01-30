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

  describe('renders success message with default text', () => {
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

  describe('displays file name when provided', () => {
    it('displays correct file name when provided', () => {
      const fileName = 'my-document.pdf';
      render(<UploadSuccessMessage {...defaultProps} fileName={fileName} />);
      
      expect(screen.getByText(fileName)).toBeInTheDocument();
    });

    it('handles empty file name gracefully', () => {
      render(
        <UploadSuccessMessage {...defaultProps} fileName="" />
      );
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('shows next steps section when showNextSteps is true', () => {
    it('renders next steps list when provided and showNextSteps is true', () => {
      const nextSteps = [
        'Review your uploaded file',
        'Click submit to process',
        'Wait for confirmation',
      ];
      
      render(
        <UploadSuccessMessage 
          {...defaultProps} 
          nextSteps={nextSteps} 
          showNextSteps={true} 
        />
      );
      
      nextSteps.forEach((step) => {
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });

    it('renders next steps as a list with correct items', () => {
      const nextSteps = ['Step 1', 'Step 2'];
      
      render(
        <UploadSuccessMessage 
          {...defaultProps} 
          nextSteps={nextSteps} 
          showNextSteps={true} 
        />
      );
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });
  });

  describe('hides next steps section when showNextSteps is false', () => {
    it('does not render next steps section when showNextSteps is false', () => {
      const nextSteps = ['Step 1', 'Step 2'];
      
      render(
        <UploadSuccessMessage 
          {...defaultProps} 
          nextSteps={nextSteps} 
          showNextSteps={false} 
        />
      );
      
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('does not render next steps section when not provided', () => {
      render(<UploadSuccessMessage {...defaultProps} />);
      
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('handles empty next steps array', () => {
      render(
        <UploadSuccessMessage {...defaultProps} nextSteps={[]} showNextSteps={true} />
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

  describe('shows processing pending message when processingPending is true', () => {
    it('displays processing pending message when processingPending is true', () => {
      render(
        <UploadSuccessMessage {...defaultProps} processingPending={true} />
      );
      
      expect(screen.getByText(/processing/i)).toBeInTheDocument();
    });

    it('does not display processing pending message when processingPending is false', () => {
      render(
        <UploadSuccessMessage {...defaultProps} processingPending={false} />
      );
      
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
    });
  });

  describe('calls onDismiss when dismiss button is clicked', () => {
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

  describe('has proper ARIA role="alert" for accessibility', () => {
    it('has role="alert" for screen reader announcement', () => {
      render(<UploadSuccessMessage {...defaultProps} />);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has correct accessibility attributes (aria-live)', () => {
      render(<UploadSuccessMessage {...defaultProps} />);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('has proper color contrast (visual regression or snapshot)', () => {
    it('matches snapshot for visual regression testing', () => {
      const { container } = render(
        <UploadSuccessMessage {...defaultProps} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with next steps', () => {
      const nextSteps = ['Step 1', 'Step 2', 'Step 3'];
      const { container } = render(
        <UploadSuccessMessage 
          {...defaultProps} 
          nextSteps={nextSteps} 
          showNextSteps={true} 
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with processing pending', () => {
      const { container } = render(
        <UploadSuccessMessage {...defaultProps} processingPending={true} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('is accessible via screen reader (check aria attributes)', () => {
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

    it('alert element has aria-atomic attribute for complete announcement', () => {
      render(<UploadSuccessMessage {...defaultProps} />);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveAttribute('aria-atomic', 'true');
    });

    it('file name is announced to screen readers', () => {
      const fileName = 'important-document.pdf';
      render(<UploadSuccessMessage {...defaultProps} fileName={fileName} />);
      
      // The file name should be within the alert region
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveTextContent(fileName);
    });

    it('next steps list has proper list semantics', () => {
      const nextSteps = ['Step 1', 'Step 2'];
      render(
        <UploadSuccessMessage 
          {...defaultProps} 
          nextSteps={nextSteps} 
          showNextSteps={true} 
        />
      );
      
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(nextSteps.length);
    });
  });
});
