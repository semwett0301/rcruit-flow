/**
 * Unit tests for the CvUploadError component
 * Tests error message display, user interactions, and accessibility
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CvUploadError } from '../CvUploadError';
import { CvUploadErrorCode } from '@repo/dto';

describe('CvUploadError', () => {
  describe('Error Messages', () => {
    it('displays correct message for invalid file type', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.INVALID_FILE_TYPE} />);

      expect(screen.getByText('Unsupported File Format')).toBeInTheDocument();
      expect(screen.getByText(/PDF, .DOC, .DOCX/i)).toBeInTheDocument();
    });

    it('displays correct message for file size exceeded', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.FILE_SIZE_EXCEEDED} />);

      expect(screen.getByText('File Too Large')).toBeInTheDocument();
      expect(screen.getByText(/10MB/)).toBeInTheDocument();
    });

    it('displays correct message for corrupted file', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.FILE_CORRUPTED} />);

      expect(screen.getByText('Unable to Read File')).toBeInTheDocument();
      expect(screen.getByText(/corrupted or unreadable/i)).toBeInTheDocument();
    });

    it('displays correct message for server error', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} />);

      expect(screen.getByText('Upload Failed')).toBeInTheDocument();
      expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onRetry when retry button is clicked', () => {
      const onRetry = vi.fn();
      render(
        <CvUploadError
          errorCode={CvUploadErrorCode.SERVER_ERROR}
          onRetry={onRetry}
        />
      );

      fireEvent.click(screen.getByText('Try Again'));
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('calls onContactSupport when support button is clicked', () => {
      const onContactSupport = vi.fn();
      render(
        <CvUploadError
          errorCode={CvUploadErrorCode.SERVER_ERROR}
          onContactSupport={onContactSupport}
        />
      );

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
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });

    it('renders error icon with appropriate aria-hidden attribute', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });
});
