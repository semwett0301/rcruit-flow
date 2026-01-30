/**
 * Unit tests for EditableEmailField component
 * Tests rendering, editing, and validation behavior
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { EditableEmailField } from '../EditableEmailField';

describe('EditableEmailField', () => {
  it('renders with initial email value', () => {
    render(<EditableEmailField initialEmail="test@example.com" onEmailChange={jest.fn()} />);
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('allows editing the email', () => {
    const onEmailChange = jest.fn();
    render(<EditableEmailField initialEmail="test@example.com" onEmailChange={onEmailChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new@example.com' } });
    expect(onEmailChange).toHaveBeenCalledWith('new@example.com', true);
  });

  it('shows error for invalid email format', () => {
    const onEmailChange = jest.fn();
    render(<EditableEmailField initialEmail="" onEmailChange={onEmailChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.blur(input);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(onEmailChange).toHaveBeenCalledWith('invalid-email', false);
  });

  it('reports valid status for correct email', () => {
    const onEmailChange = jest.fn();
    render(<EditableEmailField initialEmail="" onEmailChange={onEmailChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'valid@example.com' } });
    expect(onEmailChange).toHaveBeenCalledWith('valid@example.com', true);
  });
});
