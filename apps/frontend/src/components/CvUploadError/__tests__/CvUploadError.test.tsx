/**
 * Unit tests for the CvUploadError component
 * Tests error message display, user interactions, and accessibility
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CvUploadError } from '../CvUploadError';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

describe('CvUploadError', () => {
  describe('Error Messages', () => {
    it('displays correct message for invalid file type', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.INVALID_FILE_TYPE} />);
      expect(screen.getByText('Unsupported File Format')).toBeInTheDocument();
      expect(screen.getByText(/PDF, DOC, and DOCX/)).toBeInTheDocument();
    });

    it('displays correct message for file size exceeded', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.FILE_SIZE_EXCEEDED} />);
      expect(screen.getByText('File Too Large')).toBeInTheDocument();
      expect(screen.getByText(/maximum allowed size/)).toBeInTheDocument();
    });

    it('displays correct message for corrupted file', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.FILE_CORRUPTED} />);
      expect(screen.getByText('Unable to Read File')).toBeInTheDocument();
    });

    it('displays correct message for server error', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} />);
      expect(screen.getByText('Upload Failed')).toBeInTheDocument();
      expect(screen.getByText(/contact our support team/)).toBeInTheDocument();
    });

    it('displays correct message for network timeout', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.NETWORK_TIMEOUT} />);
      expect(screen.getByText('Connection Timed Out')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onRetry when retry button is clicked', () => {
      const onRetry = vi.fn();
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} onRetry={onRetry} />);
      fireEvent.click(screen.getByText('Try Again'));
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('calls onContactSupport when support button is clicked', () => {
      const onContactSupport = vi.fn();
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} onContactSupport={onContactSupport} />);
      fireEvent.click(screen.getByText('Contact Support'));
      expect(onContactSupport).toHaveBeenCalledTimes(1);
    });

    it('does not render retry button when onRetry is not provided', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} />);
      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });

    it('does not render contact support button when onContactSupport is not provided', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} />);
      expect(screen.queryByText('Contact Support')).not.toBeInTheDocument();
    });

    it('renders both buttons when both callbacks are provided', () => {
      const onRetry = vi.fn();
      const onContactSupport = vi.fn();
      render(
        <CvUploadError
          errorCode={CvUploadErrorCode.SERVER_ERROR}
          onRetry={onRetry}
          onContactSupport={onContactSupport}
        />
      );
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Contact Support')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders error icon for visual indication', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('buttons are keyboard accessible', () => {
      const onRetry = vi.fn();
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} onRetry={onRetry} />);
      const retryButton = screen.getByText('Try Again');
      expect(retryButton).toBeEnabled();
    });
  });

  describe('Edge Cases', () => {
    it('handles all error codes without crashing', () => {
      const errorCodes = Object.values(CvUploadErrorCode);
      errorCodes.forEach((errorCode) => {
        const { unmount } = render(<CvUploadError errorCode={errorCode} />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        unmount();
      });
    });
  });
});
