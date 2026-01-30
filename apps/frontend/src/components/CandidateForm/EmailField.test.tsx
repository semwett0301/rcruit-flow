/**
 * Unit tests for the EmailField component
 * Tests rendering, onChange handling, and email validation behavior
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailField } from './EmailField';

describe('EmailField', () => {
  it('renders with initial value', () => {
    render(<EmailField value="test@example.com" onChange={() => {}} />);
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('calls onChange when value is modified', () => {
    const handleChange = jest.fn();
    render(<EmailField value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new@email.com' } });
    expect(handleChange).toHaveBeenCalledWith('new@email.com');
  });

  it('shows error for invalid email after blur', () => {
    render(<EmailField value="invalid-email" onChange={() => {}} />);
    fireEvent.blur(screen.getByRole('textbox'));
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('calls onValidationChange with false for invalid email', () => {
    const handleValidation = jest.fn();
    render(<EmailField value="invalid" onChange={() => {}} onValidationChange={handleValidation} />);
    fireEvent.blur(screen.getByRole('textbox'));
    expect(handleValidation).toHaveBeenCalledWith(false);
  });

  it('calls onValidationChange with true for valid email', () => {
    const handleValidation = jest.fn();
    render(<EmailField value="valid@email.com" onChange={() => {}} onValidationChange={handleValidation} />);
    fireEvent.blur(screen.getByRole('textbox'));
    expect(handleValidation).toHaveBeenCalledWith(true);
  });
});
