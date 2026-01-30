/**
 * Unit tests for the EmailDisplay component
 * Tests rendering states, content display, and user interactions
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmailDisplay } from './EmailDisplay';

describe('EmailDisplay', () => {
  beforeEach(() => {
    // Mock the clipboard API for copy functionality tests
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  describe('Empty states', () => {
    it('should show empty state when no email content', () => {
      render(<EmailDisplay emailContent={null} />);
      expect(screen.getByText(/No email generated yet/i)).toBeInTheDocument();
    });

    it('should show empty state for empty string', () => {
      render(<EmailDisplay emailContent="" />);
      expect(screen.getByText(/No email generated yet/i)).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should show loading state', () => {
      render(<EmailDisplay emailContent={null} isLoading />);
      expect(screen.getByText(/Generating email/i)).toBeInTheDocument();
    });
  });

  describe('Content display', () => {
    it('should display email content when provided', () => {
      const emailContent = 'Hello, this is a test email.';
      render(<EmailDisplay emailContent={emailContent} />);
      expect(screen.getByText(emailContent)).toBeInTheDocument();
    });

    it('should display the title "Generated Email"', () => {
      render(<EmailDisplay emailContent="Test email" />);
      expect(screen.getByText('Generated Email')).toBeInTheDocument();
    });
  });

  describe('Copy button', () => {
    it('should show copy button when email is present', () => {
      render(<EmailDisplay emailContent="Test email" />);
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });

    it('should not show copy button when no email', () => {
      render(<EmailDisplay emailContent={null} />);
      expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument();
    });
  });
});
