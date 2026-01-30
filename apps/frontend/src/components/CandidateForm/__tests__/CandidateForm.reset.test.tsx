/**
 * @fileoverview Tests for CandidateForm reset functionality
 * 
 * This test suite covers the reset button behavior including:
 * - Reset button visibility and accessibility
 * - Confirmation dialog interactions
 * - Form field clearing behavior
 * - File upload clearing
 * - Validation error clearing
 * - Visual distinction from submit button
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CandidateForm from '../CandidateForm';

describe('CandidateForm Reset Functionality', () => {
  /**
   * Helper function to fill form fields with test data
   */
  const fillFormFields = async (user: ReturnType<typeof userEvent.setup>) => {
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(phoneInput, '1234567890');
  };

  /**
   * Helper function to get the reset button
   */
  const getResetButton = () => {
    return screen.getByRole('button', { name: /reset/i });
  };

  /**
   * Helper function to get the submit button
   */
  const getSubmitButton = () => {
    return screen.getByRole('button', { name: /submit/i });
  };

  /**
   * Helper function to confirm reset in dialog
   */
  const confirmReset = async (user: ReturnType<typeof userEvent.setup>) => {
    const confirmButton = screen.getByRole('button', { name: /confirm|yes/i });
    await user.click(confirmButton);
  };

  /**
   * Helper function to cancel reset in dialog
   */
  const cancelReset = async (user: ReturnType<typeof userEvent.setup>) => {
    const cancelButton = screen.getByRole('button', { name: /cancel|no/i });
    await user.click(cancelButton);
  };

  describe('renders reset button', () => {
    it('should display the reset button', () => {
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toBeVisible();
    });

    it('should have accessible name for reset button', () => {
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      
      expect(resetButton).toHaveAccessibleName();
    });

    it('should be enabled by default', () => {
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      
      expect(resetButton).toBeEnabled();
    });
  });

  describe('shows confirmation dialog when reset clicked', () => {
    it('should display confirmation dialog after clicking reset', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should show confirmation message in dialog', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByText(/are you sure|confirm|reset/i)).toBeInTheDocument();
      });
    });

    it('should display confirm and cancel options in dialog', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /confirm|yes/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel|no/i })).toBeInTheDocument();
      });
    });
  });

  describe('does not clear form when cancel is clicked', () => {
    it('should preserve form data when reset is cancelled', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      // Fill form fields
      await fillFormFields(user);
      
      // Click reset button
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      // Wait for dialog and click cancel
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      await cancelReset(user);
      
      // Verify data persists
      expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john.doe@example.com');
      expect(screen.getByLabelText(/phone/i)).toHaveValue('1234567890');
    });

    it('should close dialog when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      await cancelReset(user);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('clears all form fields when reset confirmed', () => {
    it('should clear all text input fields after confirming reset', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      // Fill all form fields
      await fillFormFields(user);
      
      // Verify fields are filled
      expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john.doe@example.com');
      expect(screen.getByLabelText(/phone/i)).toHaveValue('1234567890');
      
      // Click reset and confirm
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      await confirmReset(user);
      
      // Verify all fields are cleared
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/phone/i)).toHaveValue('');
      });
    });

    it('should close dialog after confirming reset', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      await confirmReset(user);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('clears uploaded CV file when reset confirmed', () => {
    it('should clear uploaded file after confirming reset', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      // Create a mock file
      const file = new File(['test content'], 'resume.pdf', { type: 'application/pdf' });
      
      // Upload file
      const fileInput = screen.getByLabelText(/cv|resume|file/i);
      await user.upload(fileInput, file);
      
      // Verify file is uploaded (check for file name display)
      await waitFor(() => {
        expect(screen.getByText(/resume\.pdf/i)).toBeInTheDocument();
      });
      
      // Click reset and confirm
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      await confirmReset(user);
      
      // Verify file is cleared
      await waitFor(() => {
        expect(screen.queryByText(/resume\.pdf/i)).not.toBeInTheDocument();
      });
    });

    it('should reset file input element after confirming reset', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      const file = new File(['test content'], 'resume.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText(/cv|resume|file/i) as HTMLInputElement;
      
      await user.upload(fileInput, file);
      
      // Click reset and confirm
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      await confirmReset(user);
      
      // Verify file input is cleared
      await waitFor(() => {
        expect(fileInput.files?.length).toBe(0);
      });
    });
  });

  describe('clears validation errors when reset confirmed', () => {
    it('should clear validation errors after confirming reset', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      // Trigger validation errors by submitting empty form
      const submitButton = getSubmitButton();
      await user.click(submitButton);
      
      // Verify validation errors are displayed
      await waitFor(() => {
        expect(screen.getByText(/required|invalid|error/i)).toBeInTheDocument();
      });
      
      // Click reset and confirm
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      await confirmReset(user);
      
      // Verify validation errors are cleared
      await waitFor(() => {
        expect(screen.queryByText(/required|invalid|error/i)).not.toBeInTheDocument();
      });
    });

    it('should clear email validation error after confirming reset', async () => {
      const user = userEvent.setup();
      render(<CandidateForm />);
      
      // Enter invalid email to trigger validation
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');
      
      // Trigger validation
      const submitButton = getSubmitButton();
      await user.click(submitButton);
      
      // Verify email validation error
      await waitFor(() => {
        expect(screen.getByText(/valid email|invalid email/i)).toBeInTheDocument();
      });
      
      // Click reset and confirm
      const resetButton = getResetButton();
      await user.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      await confirmReset(user);
      
      // Verify validation error is cleared
      await waitFor(() => {
        expect(screen.queryByText(/valid email|invalid email/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('reset button is visually distinct from submit', () => {
    it('should have different styling than submit button', () => {
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      const submitButton = getSubmitButton();
      
      // Check that buttons have different classes or styles
      const resetClasses = resetButton.className;
      const submitClasses = submitButton.className;
      
      // They should not have identical styling
      expect(resetClasses).not.toBe(submitClasses);
    });

    it('should have different button type than submit', () => {
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      const submitButton = getSubmitButton();
      
      // Submit should be type="submit", reset should be type="button"
      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(resetButton).toHaveAttribute('type', 'button');
    });

    it('should position reset button separately from submit', () => {
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      const submitButton = getSubmitButton();
      
      // Both buttons should be in the document and visible
      expect(resetButton).toBeVisible();
      expect(submitButton).toBeVisible();
      
      // They should be different elements
      expect(resetButton).not.toBe(submitButton);
    });

    it('should have appropriate aria attributes for distinction', () => {
      render(<CandidateForm />);
      
      const resetButton = getResetButton();
      const submitButton = getSubmitButton();
      
      // Both should have accessible names that distinguish them
      expect(resetButton.getAttribute('aria-label') || resetButton.textContent).toMatch(/reset/i);
      expect(submitButton.getAttribute('aria-label') || submitButton.textContent).toMatch(/submit/i);
    });
  });
});
