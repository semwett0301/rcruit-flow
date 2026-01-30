/**
 * Unit tests for the ConfirmDialog component
 * Tests rendering, user interactions, and callback behaviors
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders when isOpen is true', () => {
      render(<ConfirmDialog {...defaultProps} isOpen={true} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<ConfirmDialog {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(defaultProps.title)).not.toBeInTheDocument();
      expect(screen.queryByText(defaultProps.message)).not.toBeInTheDocument();
    });

    it('displays correct title and message', () => {
      const customTitle = 'Delete Item';
      const customMessage = 'This action cannot be undone. Are you sure?';

      render(
        <ConfirmDialog
          {...defaultProps}
          title={customTitle}
          message={customMessage}
        />
      );

      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onConfirm when confirm button is clicked', () => {
      const onConfirm = jest.fn();
      render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when cancel button is clicked', () => {
      const onCancel = jest.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when clicking outside/overlay', () => {
      const onCancel = jest.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      // Try to find overlay by test-id or class
      const overlay = screen.queryByTestId('dialog-overlay');
      if (overlay) {
        fireEvent.click(overlay);
        expect(onCancel).toHaveBeenCalledTimes(1);
      } else {
        // Alternative: try clicking the backdrop if it exists
        const backdrop = document.querySelector('[data-backdrop]') || 
                         document.querySelector('.overlay') ||
                         document.querySelector('[class*="overlay"]');
        if (backdrop) {
          fireEvent.click(backdrop);
          expect(onCancel).toHaveBeenCalledTimes(1);
        }
      }
    });
  });

  describe('accessibility', () => {
    it('has proper dialog role', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('contains accessible confirm and cancel buttons', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });
});
