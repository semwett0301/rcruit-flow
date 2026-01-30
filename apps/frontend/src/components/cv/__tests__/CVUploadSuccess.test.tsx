/**
 * Unit tests for CVUploadSuccess component
 * Tests CV-specific success message display and interaction
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CVUploadSuccess from '../CVUploadSuccess';

describe('CVUploadSuccess', () => {
  const defaultProps = {
    fileName: 'test-resume.pdf',
    isVisible: true,
    onDismiss: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct CV-specific title', () => {
    render(<CVUploadSuccess {...defaultProps} />);
    
    expect(screen.getByText(/cv uploaded successfully/i)).toBeInTheDocument();
  });

  it('displays fileName in message', () => {
    const fileName = 'my-awesome-resume.pdf';
    render(<CVUploadSuccess {...defaultProps} fileName={fileName} />);
    
    expect(screen.getByText(new RegExp(fileName))).toBeInTheDocument();
  });

  it('shows next steps information', () => {
    render(<CVUploadSuccess {...defaultProps} />);
    
    expect(screen.getByText(/next steps/i)).toBeInTheDocument();
  });

  it('passes visibility prop correctly to SuccessMessage', () => {
    const { rerender } = render(
      <CVUploadSuccess {...defaultProps} isVisible={true} />
    );
    
    // Component should be visible when isVisible is true
    expect(screen.getByText(/cv uploaded successfully/i)).toBeVisible();
    
    // Rerender with isVisible false
    rerender(<CVUploadSuccess {...defaultProps} isVisible={false} />);
    
    // Component should not be visible or not in document when isVisible is false
    expect(screen.queryByText(/cv uploaded successfully/i)).not.toBeInTheDocument();
  });

  it('calls onDismiss when triggered', async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    
    render(<CVUploadSuccess {...defaultProps} onDismiss={onDismiss} />);
    
    // Find and click the dismiss button/element
    const dismissButton = screen.getByRole('button', { name: /dismiss|close/i });
    await user.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
