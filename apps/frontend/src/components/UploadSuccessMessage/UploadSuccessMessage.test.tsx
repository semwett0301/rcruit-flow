/**
 * Unit tests for the UploadSuccessMessage component
 * Tests rendering, props handling, user interactions, and accessibility
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UploadSuccessMessage } from './UploadSuccessMessage';

describe('UploadSuccessMessage', () => {
  it('renders success message with default content', () => {
    render(<UploadSuccessMessage />);
    
    expect(screen.getByText('Upload Successful!')).toBeInTheDocument();
    expect(screen.getByText(/Your CV has been received and processed successfully/)).toBeInTheDocument();
  });

  it('displays the uploaded file name when provided', () => {
    render(<UploadSuccessMessage fileName="resume.pdf" />);
    
    expect(screen.getByText(/Your CV "resume.pdf" has been/)).toBeInTheDocument();
  });

  it('renders default next steps', () => {
    render(<UploadSuccessMessage />);
    
    expect(screen.getByText('What happens next:')).toBeInTheDocument();
    expect(screen.getByText('Your CV will be reviewed by our team')).toBeInTheDocument();
    expect(screen.getByText('You will receive an email confirmation shortly')).toBeInTheDocument();
  });

  it('renders custom next steps when provided', () => {
    const customSteps = ['Step 1', 'Step 2'];
    render(<UploadSuccessMessage nextSteps={customSteps} />);
    
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<UploadSuccessMessage onDismiss={onDismiss} />);
    
    fireEvent.click(screen.getByText('Got it'));
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render dismiss button when onDismiss is not provided', () => {
    render(<UploadSuccessMessage />);
    
    expect(screen.queryByText('Got it')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<UploadSuccessMessage />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });
});
