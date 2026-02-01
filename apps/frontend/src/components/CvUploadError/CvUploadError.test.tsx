/**
 * Unit tests for the CvUploadError component
 * Tests error display, retry functionality, and user interactions
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CvUploadError } from './CvUploadError';
import { CvUploadErrorCode } from '@rcruit-flow/dto';

describe('CvUploadError', () => {
  const defaultProps = {
    title: 'Test Error',
    message: 'Test error message',
    action: 'Test action'
  };

  it('renders error title, message, and action', () => {
    render(<CvUploadError {...defaultProps} />);
    
    expect(screen.getByText('Test Error')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Test action')).toBeInTheDocument();
  });

  it('shows retry button for retryable errors', () => {
    const onRetry = vi.fn();
    render(
      <CvUploadError 
        {...defaultProps} 
        code={CvUploadErrorCode.NETWORK_ERROR}
        onRetry={onRetry}
      />
    );
    
    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it('does not show retry button for non-retryable errors', () => {
    render(
      <CvUploadError 
        {...defaultProps} 
        code={CvUploadErrorCode.INVALID_FILE_TYPE}
        onRetry={() => {}}
      />
    );
    
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('shows contact support link when enabled', () => {
    render(<CvUploadError {...defaultProps} showContactSupport />);
    
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  it('does not show contact support link when disabled', () => {
    render(<CvUploadError {...defaultProps} showContactSupport={false} />);
    
    expect(screen.queryByText('Contact Support')).not.toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<CvUploadError {...defaultProps} onDismiss={onDismiss} />);
    
    fireEvent.click(screen.getByLabelText('Dismiss error'));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('does not render dismiss button when onDismiss is not provided', () => {
    render(<CvUploadError {...defaultProps} />);
    
    expect(screen.queryByLabelText('Dismiss error')).not.toBeInTheDocument();
  });

  it('does not show retry button when onRetry is not provided', () => {
    render(
      <CvUploadError 
        {...defaultProps} 
        code={CvUploadErrorCode.NETWORK_ERROR}
      />
    );
    
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('renders with minimal props', () => {
    render(
      <CvUploadError 
        title="Minimal Error" 
        message="Minimal message" 
        action="Minimal action" 
      />
    );
    
    expect(screen.getByText('Minimal Error')).toBeInTheDocument();
    expect(screen.getByText('Minimal message')).toBeInTheDocument();
    expect(screen.getByText('Minimal action')).toBeInTheDocument();
  });

  it('calls onRetry only once per click', () => {
    const onRetry = vi.fn();
    render(
      <CvUploadError 
        {...defaultProps} 
        code={CvUploadErrorCode.NETWORK_ERROR}
        onRetry={onRetry}
      />
    );
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(2);
  });
});
