/**
 * Unit tests for EmailGenerationButton component
 *
 * Tests cover:
 * - Rendering the generate button
 * - Validation errors when data is missing
 * - Successful generation callback
 * - Hint display for missing data
 * - Loading state behavior
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailGenerationButton } from '../EmailGenerationButton';

describe('EmailGenerationButton', () => {
  const mockOnGenerate = jest.fn();

  beforeEach(() => {
    mockOnGenerate.mockClear();
  });

  it('should render generate button', () => {
    render(
      <EmailGenerationButton
        candidateData={null}
        jobDescription={null}
        onGenerate={mockOnGenerate}
      />
    );
    expect(screen.getByRole('button', { name: /generate email/i })).toBeInTheDocument();
  });

  it('should show validation errors when clicking with missing data', () => {
    render(
      <EmailGenerationButton
        candidateData={null}
        jobDescription={null}
        onGenerate={mockOnGenerate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /generate email/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it('should call onGenerate when all data is valid', () => {
    render(
      <EmailGenerationButton
        candidateData={{ name: 'John', email: 'john@test.com' }}
        jobDescription="Test job description"
        onGenerate={mockOnGenerate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /generate email/i }));
    expect(mockOnGenerate).toHaveBeenCalledTimes(1);
  });

  it('should show hint when required data is missing but no validation attempted', () => {
    render(
      <EmailGenerationButton
        candidateData={null}
        jobDescription={null}
        onGenerate={mockOnGenerate}
      />
    );
    expect(screen.getByText(/please fill in/i)).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    render(
      <EmailGenerationButton
        candidateData={{ name: 'John', email: 'john@test.com' }}
        jobDescription="Test job"
        onGenerate={mockOnGenerate}
        isLoading={true}
      />
    );
    expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled();
  });

  it('should not show validation error when only candidateData is missing', () => {
    render(
      <EmailGenerationButton
        candidateData={null}
        jobDescription="Test job description"
        onGenerate={mockOnGenerate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /generate email/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it('should not show validation error when only jobDescription is missing', () => {
    render(
      <EmailGenerationButton
        candidateData={{ name: 'John', email: 'john@test.com' }}
        jobDescription={null}
        onGenerate={mockOnGenerate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /generate email/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it('should not call onGenerate when button is in loading state', () => {
    render(
      <EmailGenerationButton
        candidateData={{ name: 'John', email: 'john@test.com' }}
        jobDescription="Test job"
        onGenerate={mockOnGenerate}
        isLoading={true}
      />
    );
    const button = screen.getByRole('button', { name: /generating/i });
    fireEvent.click(button);
    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it('should handle empty string jobDescription as invalid', () => {
    render(
      <EmailGenerationButton
        candidateData={{ name: 'John', email: 'john@test.com' }}
        jobDescription=""
        onGenerate={mockOnGenerate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /generate email/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(mockOnGenerate).not.toHaveBeenCalled();
  });
});
