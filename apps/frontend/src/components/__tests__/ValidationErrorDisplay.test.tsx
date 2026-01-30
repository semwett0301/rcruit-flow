/**
 * Unit tests for ValidationErrorDisplay component
 * Tests rendering behavior, error display, dismiss functionality, and accessibility
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ValidationErrorDisplay } from '../ValidationErrorDisplay';

describe('ValidationErrorDisplay', () => {
  it('should not render when there are no errors', () => {
    const { container } = render(<ValidationErrorDisplay errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render all error messages', () => {
    const errors = [
      { field: 'candidate', message: 'Candidate data is required.' },
      { field: 'jobDescription', message: 'Job description is required.' },
    ];
    render(<ValidationErrorDisplay errors={errors} />);
    
    expect(screen.getByText('Candidate data is required.')).toBeInTheDocument();
    expect(screen.getByText('Job description is required.')).toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    const errors = [{ field: 'test', message: 'Test error' }];
    render(<ValidationErrorDisplay errors={errors} onDismiss={onDismiss} />);
    
    fireEvent.click(screen.getByLabelText('Dismiss errors'));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    const errors = [{ field: 'test', message: 'Test error' }];
    render(<ValidationErrorDisplay errors={errors} />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render a single error message correctly', () => {
    const errors = [{ field: 'email', message: 'Invalid email format.' }];
    render(<ValidationErrorDisplay errors={errors} />);
    
    expect(screen.getByText('Invalid email format.')).toBeInTheDocument();
  });

  it('should not render dismiss button when onDismiss is not provided', () => {
    const errors = [{ field: 'test', message: 'Test error' }];
    render(<ValidationErrorDisplay errors={errors} />);
    
    expect(screen.queryByLabelText('Dismiss errors')).not.toBeInTheDocument();
  });

  it('should render dismiss button when onDismiss is provided', () => {
    const onDismiss = jest.fn();
    const errors = [{ field: 'test', message: 'Test error' }];
    render(<ValidationErrorDisplay errors={errors} onDismiss={onDismiss} />);
    
    expect(screen.getByLabelText('Dismiss errors')).toBeInTheDocument();
  });

  it('should handle multiple errors with same field', () => {
    const errors = [
      { field: 'password', message: 'Password is too short.' },
      { field: 'password', message: 'Password must contain a number.' },
    ];
    render(<ValidationErrorDisplay errors={errors} />);
    
    expect(screen.getByText('Password is too short.')).toBeInTheDocument();
    expect(screen.getByText('Password must contain a number.')).toBeInTheDocument();
  });

  it('should call onDismiss only once per click', () => {
    const onDismiss = jest.fn();
    const errors = [{ field: 'test', message: 'Test error' }];
    render(<ValidationErrorDisplay errors={errors} onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByLabelText('Dismiss errors');
    fireEvent.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
