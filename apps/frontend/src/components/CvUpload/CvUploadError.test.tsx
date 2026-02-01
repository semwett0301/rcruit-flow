/**
 * Unit tests for CvUploadError component
 * Tests error display, retry functionality, dismiss behavior, and accessibility
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { CvUploadError } from './CvUploadError';
import { cvUploadErrorMessages } from '../../constants/cvUploadErrors';
import { CvUploadErrorCode } from '@repo/dto';

describe('CvUploadError', () => {
  const mockOnRetry = jest.fn();
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error title and message', () => {
    const error = cvUploadErrorMessages[CvUploadErrorCode.INVALID_FILE_TYPE];
    render(<CvUploadError error={error} />);

    expect(screen.getByText(error.title)).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('renders all suggestions', () => {
    const error = cvUploadErrorMessages[CvUploadErrorCode.FILE_SIZE_EXCEEDED];
    render(<CvUploadError error={error} />);

    error.suggestions.forEach(suggestion => {
      expect(screen.getByText(suggestion)).toBeInTheDocument();
    });
  });

  it('shows retry button when error is retryable', () => {
    const error = cvUploadErrorMessages[CvUploadErrorCode.SERVER_ERROR];
    render(<CvUploadError error={error} onRetry={mockOnRetry} />);

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('hides retry button when error is not retryable', () => {
    const error = cvUploadErrorMessages[CvUploadErrorCode.INVALID_FILE_TYPE];
    render(<CvUploadError error={error} onRetry={mockOnRetry} />);

    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('shows contact support link when applicable', () => {
    const error = cvUploadErrorMessages[CvUploadErrorCode.SERVER_ERROR];
    render(<CvUploadError error={error} />);

    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  it('hides contact support when not applicable', () => {
    const error = cvUploadErrorMessages[CvUploadErrorCode.INVALID_FILE_TYPE];
    render(<CvUploadError error={error} />);

    expect(screen.queryByText('Contact Support')).not.toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button clicked', () => {
    const error = cvUploadErrorMessages[CvUploadErrorCode.UNKNOWN_ERROR];
    render(<CvUploadError error={error} onDismiss={mockOnDismiss} />);

    fireEvent.click(screen.getByText('Dismiss'));
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    const error = cvUploadErrorMessages[CvUploadErrorCode.SERVER_ERROR];
    render(<CvUploadError error={error} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });
});
