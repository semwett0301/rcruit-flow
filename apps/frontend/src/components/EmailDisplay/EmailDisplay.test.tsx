/**
 * Unit tests for the EmailDisplay component
 * Tests rendering states: empty, loading, and with content
 * Tests copy button visibility based on component state
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmailDisplay } from './EmailDisplay';

describe('EmailDisplay', () => {
  beforeEach(() => {
    // Mock clipboard API for copy functionality tests
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no email content', () => {
      render(<EmailDisplay emailContent={null} />);
      expect(screen.getByText(/No email generated yet/i)).toBeInTheDocument();
    });

    it('should show empty state when email content is empty string', () => {
      render(<EmailDisplay emailContent="" />);
      expect(screen.getByText(/No email generated yet/i)).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading state', () => {
      render(<EmailDisplay emailContent={null} isLoading />);
      expect(screen.getByText(/Generating email/i)).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('should display email content when provided', () => {
      const emailContent = 'Dear Candidate,\n\nWe are pleased to inform you...';
      render(<EmailDisplay emailContent={emailContent} />);
      
      expect(screen.getByText('Generated Email')).toBeInTheDocument();
      expect(screen.getByText(emailContent)).toBeInTheDocument();
    });
  });

  describe('Copy Button', () => {
    it('should show copy button when email is generated', () => {
      render(<EmailDisplay emailContent="Test email content" />);
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });

    it('should not show copy button in empty state', () => {
      render(<EmailDisplay emailContent={null} />);
      expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument();
    });

    it('should not show copy button in loading state', () => {
      render(<EmailDisplay emailContent={null} isLoading />);
      expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument();
    });
  });
});
