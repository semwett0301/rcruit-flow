/**
 * Unit tests for EditableEmailField component
 *
 * Tests cover:
 * - Initial rendering with email value
 * - Email editing functionality
 * - Email validation and error display
 * - Disabled state handling
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { EditableEmailField } from '../EditableEmailField';

describe('EditableEmailField', () => {
  const mockOnEmailChange = jest.fn();

  beforeEach(() => {
    mockOnEmailChange.mockClear();
  });

  it('renders with initial email value', () => {
    render(
      <EditableEmailField
        initialEmail="test@example.com"
        onEmailChange={mockOnEmailChange}
      />
    );
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('allows editing the email', () => {
    render(
      <EditableEmailField
        initialEmail="test@example.com"
        onEmailChange={mockOnEmailChange}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new@example.com' } });
    expect(mockOnEmailChange).toHaveBeenCalledWith('new@example.com', true);
  });

  it('shows error for invalid email format', () => {
    render(
      <EditableEmailField
        initialEmail="test@example.com"
        onEmailChange={mockOnEmailChange}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.blur(input);
    expect(screen.getByRole('alert')).toHaveTextContent('valid email');
    expect(mockOnEmailChange).toHaveBeenCalledWith('invalid-email', false);
  });

  it('disables input when disabled prop is true', () => {
    render(
      <EditableEmailField
        initialEmail="test@example.com"
        onEmailChange={mockOnEmailChange}
        disabled={true}
      />
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
