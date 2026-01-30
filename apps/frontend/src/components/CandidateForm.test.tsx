import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CandidateForm from './CandidateForm';

/**
 * Test suite for CandidateForm reset functionality
 * Tests the reset button behavior, confirmation dialog, and form state clearing
 */
describe('CandidateForm Reset Functionality', () => {
  const mockOnSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Helper function to fill the form with test data
   */
  const fillFormWithTestData = async () => {
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const positionInput = screen.getByLabelText(/position/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(phoneInput, '1234567890');
    await user.type(positionInput, 'Software Engineer');
  };

  /**
   * Helper function to upload a mock CV file
   */
  const uploadMockCVFile = async () => {
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/cv|resume|upload/i);
    await user.upload(fileInput, file);
    return file;
  };

  /**
   * Helper function to trigger validation errors by submitting empty form
   */
  const triggerValidationErrors = async () => {
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
  };

  it('should display reset button on the form', () => {
    render(<CandidateForm onSubmit={mockOnSubmit} />);

    const resetButton = screen.getByRole('button', { name: /reset/i });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toBeVisible();
  });

  it('should open confirmation dialog when clicking reset button', async () => {
    render(<CandidateForm onSubmit={mockOnSubmit} />);

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Check that confirmation dialog is displayed
    const confirmDialog = screen.getByRole('dialog');
    expect(confirmDialog).toBeInTheDocument();
    expect(screen.getByText(/are you sure|confirm|reset form/i)).toBeInTheDocument();
  });

  it('should keep form data intact when canceling confirmation dialog', async () => {
    render(<CandidateForm onSubmit={mockOnSubmit} />);

    // Fill form with test data
    await fillFormWithTestData();

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Cancel the confirmation dialog
    const cancelButton = screen.getByRole('button', { name: /cancel|no/i });
    await user.click(cancelButton);

    // Verify form data is still intact
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john.doe@example.com');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('1234567890');
    expect(screen.getByLabelText(/position/i)).toHaveValue('Software Engineer');
  });

  it('should clear all text input fields when confirming reset', async () => {
    render(<CandidateForm onSubmit={mockOnSubmit} />);

    // Fill form with test data
    await fillFormWithTestData();

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Confirm the reset
    const confirmButton = screen.getByRole('button', { name: /confirm|yes|ok/i });
    await user.click(confirmButton);

    // Verify all text fields are cleared
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/phone/i)).toHaveValue('');
      expect(screen.getByLabelText(/position/i)).toHaveValue('');
    });
  });

  it('should remove uploaded CV file when confirming reset', async () => {
    render(<CandidateForm onSubmit={mockOnSubmit} />);

    // Upload a mock CV file
    await uploadMockCVFile();

    // Verify file is uploaded (file name should be displayed)
    expect(screen.getByText(/resume\.pdf/i)).toBeInTheDocument();

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Confirm the reset
    const confirmButton = screen.getByRole('button', { name: /confirm|yes|ok/i });
    await user.click(confirmButton);

    // Verify file is removed
    await waitFor(() => {
      expect(screen.queryByText(/resume\.pdf/i)).not.toBeInTheDocument();
    });
  });

  it('should clear validation errors when confirming reset', async () => {
    render(<CandidateForm onSubmit={mockOnSubmit} />);

    // Trigger validation errors by submitting empty form
    await triggerValidationErrors();

    // Verify validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/required|invalid|error/i)).toBeInTheDocument();
    });

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Confirm the reset
    const confirmButton = screen.getByRole('button', { name: /confirm|yes|ok/i });
    await user.click(confirmButton);

    // Verify validation errors are cleared
    await waitFor(() => {
      expect(screen.queryByText(/required|invalid|error/i)).not.toBeInTheDocument();
    });
  });

  it('should return form to initial empty state after reset', async () => {
    render(<CandidateForm onSubmit={mockOnSubmit} />);

    // Fill form with test data
    await fillFormWithTestData();

    // Upload a mock CV file
    await uploadMockCVFile();

    // Trigger validation errors (by clearing a required field and submitting)
    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await triggerValidationErrors();

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Confirm the reset
    const confirmButton = screen.getByRole('button', { name: /confirm|yes|ok/i });
    await user.click(confirmButton);

    // Verify form is in initial empty state
    await waitFor(() => {
      // All text fields should be empty
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/phone/i)).toHaveValue('');
      expect(screen.getByLabelText(/position/i)).toHaveValue('');

      // No file should be uploaded
      expect(screen.queryByText(/resume\.pdf/i)).not.toBeInTheDocument();

      // No validation errors should be displayed
      expect(screen.queryByText(/required|invalid|error/i)).not.toBeInTheDocument();
    });
  });

  it('should complete full reset flow: fill form, upload CV, trigger errors, reset, and verify clean state', async () => {
    render(<CandidateForm onSubmit={mockOnSubmit} />);

    // Step 1: Fill form with test data
    await fillFormWithTestData();

    // Step 2: Upload a mock CV file
    await uploadMockCVFile();
    expect(screen.getByText(/resume\.pdf/i)).toBeInTheDocument();

    // Step 3: Trigger validation errors (clear email and submit)
    const emailInput = screen.getByLabelText(/email/i);
    await user.clear(emailInput);
    await triggerValidationErrors();

    // Verify error is shown
    await waitFor(() => {
      expect(screen.getByText(/required|invalid|error/i)).toBeInTheDocument();
    });

    // Step 4: Click reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Verify confirmation dialog appears
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Step 5: Confirm in dialog
    const confirmButton = screen.getByRole('button', { name: /confirm|yes|ok/i });
    await user.click(confirmButton);

    // Step 6: Assert all fields are empty and errors cleared
    await waitFor(() => {
      // Text fields are empty
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/phone/i)).toHaveValue('');
      expect(screen.getByLabelText(/position/i)).toHaveValue('');

      // CV file is removed
      expect(screen.queryByText(/resume\.pdf/i)).not.toBeInTheDocument();

      // Validation errors are cleared
      expect(screen.queryByText(/required|invalid|error/i)).not.toBeInTheDocument();
    });

    // Confirmation dialog should be closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
