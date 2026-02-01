/**
 * Unit tests for CV Upload component error display functionality
 * Tests the CvUploadError component and CvUpload component error handling
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CvUpload } from '../CvUpload';
import { CvUploadError } from '../CvUploadError';
import { CV_UPLOAD_ERROR_MESSAGES } from '../../../constants/cv-upload-messages';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

describe('CvUploadError', () => {
  describe('error content display', () => {
    it('displays error title, message, and suggestion for FILE_TOO_LARGE error', () => {
      const error = CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.FILE_TOO_LARGE];
      render(<CvUploadError error={error} />);

      expect(screen.getByText(error.title)).toBeInTheDocument();
      expect(screen.getByText(error.message)).toBeInTheDocument();
      expect(screen.getByText(/What to do:/)).toBeInTheDocument();
    });

    it('displays error title, message, and suggestion for SERVER_ERROR', () => {
      const error = CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.SERVER_ERROR];
      render(<CvUploadError error={error} />);

      expect(screen.getByText(error.title)).toBeInTheDocument();
      expect(screen.getByText(error.message)).toBeInTheDocument();
      expect(screen.getByText(/What to do:/)).toBeInTheDocument();
    });

    it('displays error title, message, and suggestion for INVALID_FILE_TYPE', () => {
      const error = CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.INVALID_FILE_TYPE];
      render(<CvUploadError error={error} />);

      expect(screen.getByText(error.title)).toBeInTheDocument();
      expect(screen.getByText(error.message)).toBeInTheDocument();
      expect(screen.getByText(/What to do:/)).toBeInTheDocument();
    });
  });

  describe('retry functionality', () => {
    it('calls onRetry when retry button is clicked', () => {
      const onRetry = jest.fn();
      const error = CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.SERVER_ERROR];
      render(<CvUploadError error={error} onRetry={onRetry} />);

      fireEvent.click(screen.getByText('Try Again'));
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('does not render retry button when onRetry is not provided', () => {
      const error = CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.SERVER_ERROR];
      render(<CvUploadError error={error} />);

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });
  });

  describe('dismiss functionality', () => {
    it('calls onDismiss when dismiss button is clicked', () => {
      const onDismiss = jest.fn();
      const error = CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.INVALID_FILE_TYPE];
      render(<CvUploadError error={error} onDismiss={onDismiss} />);

      fireEvent.click(screen.getByLabelText('Dismiss error'));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not render dismiss button when onDismiss is not provided', () => {
      const error = CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.INVALID_FILE_TYPE];
      render(<CvUploadError error={error} />);

      expect(screen.queryByLabelText('Dismiss error')).not.toBeInTheDocument();
    });
  });

  describe('combined callbacks', () => {
    it('renders both retry and dismiss buttons when both callbacks are provided', () => {
      const onRetry = jest.fn();
      const onDismiss = jest.fn();
      const error = CV_UPLOAD_ERROR_MESSAGES[CvUploadErrorCode.SERVER_ERROR];
      render(<CvUploadError error={error} onRetry={onRetry} onDismiss={onDismiss} />);

      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByLabelText('Dismiss error')).toBeInTheDocument();
    });
  });
});

describe('CvUpload', () => {
  describe('initial render', () => {
    it('displays accepted file formats in help text', () => {
      render(<CvUpload />);
      expect(screen.getByText(/Accepted formats:/)).toBeInTheDocument();
      expect(screen.getByText(/\.pdf/)).toBeInTheDocument();
    });

    it('renders file input element', () => {
      render(<CvUpload />);
      const input = document.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('file validation errors', () => {
    it('shows error message for invalid file type', async () => {
      render(<CvUpload />);

      const file = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      const input = document.querySelector('input[type="file"]');

      if (input) {
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
          expect(screen.queryByText(/Invalid File Type/)).toBeInTheDocument();
        });
      }
    });

    it('shows error message for file that is too large', async () => {
      render(<CvUpload />);

      // Create a mock file that exceeds size limit (simulated)
      const largeContent = new Array(11 * 1024 * 1024).fill('a').join(''); // 11MB
      const file = new File([largeContent], 'large-cv.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]');

      if (input) {
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
          expect(screen.queryByText(/File Too Large/i)).toBeInTheDocument();
        });
      }
    });

    it('does not show error for valid PDF file', async () => {
      render(<CvUpload />);

      const file = new File(['test content'], 'valid-cv.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]');

      if (input) {
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
          expect(screen.queryByText(/Invalid File Type/)).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('error dismissal', () => {
    it('clears error when dismiss button is clicked', async () => {
      render(<CvUpload />);

      const file = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      const input = document.querySelector('input[type="file"]');

      if (input) {
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
          expect(screen.queryByText(/Invalid File Type/)).toBeInTheDocument();
        });

        const dismissButton = screen.queryByLabelText('Dismiss error');
        if (dismissButton) {
          fireEvent.click(dismissButton);

          await waitFor(() => {
            expect(screen.queryByText(/Invalid File Type/)).not.toBeInTheDocument();
          });
        }
      }
    });
  });
});
