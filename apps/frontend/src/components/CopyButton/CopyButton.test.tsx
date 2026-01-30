/**
 * Unit tests for the CopyButton component
 * Tests rendering, user interactions, clipboard functionality, and various states
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    Object.assign(navigator, { clipboard: originalClipboard });
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with default label', () => {
      render(<CopyButton text="test" />);
      expect(screen.getByText('Copy to Clipboard')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      render(<CopyButton text="test" label="Copy Email" />);
      expect(screen.getByText('Copy Email')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<CopyButton text="test" className="custom-class" />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('disabled state', () => {
    it('should be disabled when text is empty', () => {
      render(<CopyButton text="" />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<CopyButton text="test" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not be disabled when text is provided and disabled is false', () => {
      render(<CopyButton text="test" disabled={false} />);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('copy functionality', () => {
    it('should copy text and show success state', async () => {
      render(<CopyButton text="test text" successLabel="Copied!" />);
      
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    });

    it('should call clipboard.writeText with the correct text', async () => {
      const textToCopy = 'Hello, World!';
      render(<CopyButton text={textToCopy} />);
      
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
      });
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(textToCopy);
    });

    it('should show error state when copy fails', async () => {
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Failed'));
      
      render(<CopyButton text="test" errorLabel="Failed to copy" />);
      
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Failed to copy')).toBeInTheDocument();
      });
    });

    it('should not attempt to copy when button is disabled', () => {
      render(<CopyButton text="test" disabled />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });
  });
});
