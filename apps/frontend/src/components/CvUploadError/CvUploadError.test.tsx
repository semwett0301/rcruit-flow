/**
 * Unit tests for the CvUploadError component
 * Tests error message display, user interactions, and accessibility
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { CvUploadError } from './CvUploadError';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

describe('CvUploadError', () => {
  describe('Error Messages', () => {
    it('displays correct message for invalid file type', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.INVALID_FILE_TYPE} />);
      expect(screen.getByText('Unsupported File Format')).toBeInTheDocument();
      expect(screen.getByText(/PDF, DOC, or DOCX/)).toBeInTheDocument();
    });

    it('displays correct message for file size exceeded', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.FILE_SIZE_EXCEEDED} />);
      expect(screen.getByText('File Too Large')).toBeInTheDocument();
      expect(screen.getByText(/10MB/)).toBeInTheDocument();
    });

    it('displays correct message for corrupted file', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.FILE_CORRUPTED} />);
      expect(screen.getByText('File Cannot Be Processed')).toBeInTheDocument();
      expect(screen.getByText(/corrupted/)).toBeInTheDocument();
    });

    it('displays correct message for server error with support link', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} />);
      expect(screen.getByText('Upload Failed')).toBeInTheDocument();
      expect(screen.getByText(/contact support/i)).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', 'mailto:support@rcruit-flow.com');
    });
  });

  describe('User Interactions', () => {
    it('calls onRetry when retry button is clicked', () => {
      const onRetry = jest.fn();
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} onRetry={onRetry} />);
      fireEvent.click(screen.getByText('Try Again'));
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('calls onDismiss when dismiss button is clicked', () => {
      const onDismiss = jest.fn();
      render(<CvUploadError errorCode={CvUploadErrorCode.SERVER_ERROR} onDismiss={onDismiss} />);
      fireEvent.click(screen.getByText('Dismiss'));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      render(<CvUploadError errorCode={CvUploadErrorCode.INVALID_FILE_TYPE} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
