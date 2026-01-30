/**
 * Unit tests for the CVUpload component
 * Tests file upload functionality, success/error states, and callback handling
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CVUpload } from './CVUpload';

describe('CVUpload', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders upload button initially', () => {
    render(<CVUpload />);
    
    expect(screen.getByText('Select CV to Upload')).toBeInTheDocument();
  });

  it('shows success message after successful upload', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<CVUpload />);
    
    const input = screen.getByRole('textbox', { hidden: true }) || document.querySelector('input[type="file"]');
    const file = new File(['test content'], 'resume.pdf', { type: 'application/pdf' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
    });
    
    fireEvent.change(input!);
    
    await waitFor(() => {
      expect(screen.getByText('Upload Successful!')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/resume.pdf/)).toBeInTheDocument();
  });

  it('does not show success message on upload failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    render(<CVUpload />);
    
    const input = document.querySelector('input[type="file"]');
    const file = new File(['test content'], 'resume.pdf', { type: 'application/pdf' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
    });
    
    fireEvent.change(input!);
    
    await waitFor(() => {
      expect(screen.queryByText('Upload Successful!')).not.toBeInTheDocument();
    });
  });

  it('calls onUploadComplete callback after successful upload', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const onUploadComplete = vi.fn();
    render(<CVUpload onUploadComplete={onUploadComplete} />);
    
    const input = document.querySelector('input[type="file"]');
    const file = new File(['test content'], 'resume.pdf', { type: 'application/pdf' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
    });
    
    fireEvent.change(input!);
    
    await waitFor(() => {
      expect(onUploadComplete).toHaveBeenCalledWith('resume.pdf');
    });
  });

  it('resets to upload form when dismiss button is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<CVUpload />);
    
    const input = document.querySelector('input[type="file"]');
    const file = new File(['test content'], 'resume.pdf', { type: 'application/pdf' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
    });
    
    fireEvent.change(input!);
    
    await waitFor(() => {
      expect(screen.getByText('Upload Successful!')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Got it'));
    
    expect(screen.getByText('Select CV to Upload')).toBeInTheDocument();
  });

  it('does not call onUploadComplete callback on upload failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    const onUploadComplete = vi.fn();
    render(<CVUpload onUploadComplete={onUploadComplete} />);
    
    const input = document.querySelector('input[type="file"]');
    const file = new File(['test content'], 'resume.pdf', { type: 'application/pdf' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
    });
    
    fireEvent.change(input!);
    
    await waitFor(() => {
      expect(onUploadComplete).not.toHaveBeenCalled();
    });
  });

  it('handles network error gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(<CVUpload />);
    
    const input = document.querySelector('input[type="file"]');
    const file = new File(['test content'], 'resume.pdf', { type: 'application/pdf' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
    });
    
    fireEvent.change(input!);
    
    await waitFor(() => {
      expect(screen.queryByText('Upload Successful!')).not.toBeInTheDocument();
    });
  });

  it('does nothing when no file is selected', () => {
    render(<CVUpload />);
    
    const input = document.querySelector('input[type="file"]');
    
    Object.defineProperty(input, 'files', {
      value: [],
    });
    
    fireEvent.change(input!);
    
    expect(screen.getByText('Select CV to Upload')).toBeInTheDocument();
    expect(screen.queryByText('Upload Successful!')).not.toBeInTheDocument();
  });
});
