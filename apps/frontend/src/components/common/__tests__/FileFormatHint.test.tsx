/**
 * Unit tests for the FileFormatHint component
 * Tests rendering of accepted formats, max file size, and custom className support
 */
import { render, screen } from '@testing-library/react';
import { FileFormatHint } from '../FileFormatHint';
import { CV_ACCEPTED_FORMATS } from '@repo/dto';

describe('FileFormatHint', () => {
  it('renders accepted formats text', () => {
    render(<FileFormatHint />);
    expect(screen.getByText('Accepted formats:')).toBeInTheDocument();
    expect(screen.getByText(CV_ACCEPTED_FORMATS.displayText)).toBeInTheDocument();
  });

  it('renders max file size', () => {
    render(<FileFormatHint />);
    expect(screen.getByText(`(Max size: ${CV_ACCEPTED_FORMATS.maxSizeDisplay})`)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<FileFormatHint className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
