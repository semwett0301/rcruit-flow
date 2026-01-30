/**
 * Unit tests for the CopyButton component
 * Tests copy functionality, states, and accessibility
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    // Mock the clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    // Restore original clipboard
    Object.assign(navigator, { clipboard: originalClipboard });
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with default label', () => {
      render(<CopyButton text="test" />);
      expect(screen.getByText('Copy to clipboard')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      render(<CopyButton text="test" label="Copy Email" />);
      expect(screen.getByText('Copy Email')).toBeInTheDocument();
    });

    it('should render as a button element', () => {
      render(<CopyButton text="test" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<CopyButton text="test" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not copy when disabled', async () => {
      render(<CopyButton text="test" disabled />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });
  });

  describe('copy functionality', () => {
    it('should copy text when clicked', async () => {
      render(<CopyButton text="test content" />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test content');
      });
    });

    it('should copy text with special characters', async () => {
      const specialText = '<script>alert("xss")</script>';
      render(<CopyButton text={specialText} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(specialText);
      });
    });

    it('should copy empty string when text is empty', async () => {
      render(<CopyButton text="" />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
      });
    });
  });

  describe('success state', () => {
    it('should show success state after copying', async () => {
      render(<CopyButton text="test" />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should show error message when copy fails', async () => {
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Failed'));
      
      render(<CopyButton text="test" />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('should handle clipboard permission denied', async () => {
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(
        new DOMException('Permission denied', 'NotAllowedError')
      );
      
      render(<CopyButton text="test" />);
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });
});
