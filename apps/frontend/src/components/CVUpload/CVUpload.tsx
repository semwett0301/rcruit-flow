/**
 * CVUpload Component
 * 
 * A component for uploading CV/resume files with integrated success messaging.
 * Handles upload states including success, processing, and error states.
 */

import React, { useCallback, useRef, useState } from 'react';
import { UploadSuccessMessage } from '../UploadSuccessMessage/UploadSuccessMessage';
import { useUploadStatus } from '../../hooks/useUploadStatus';

/** Accepted file types for CV upload */
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/** Maximum file size in bytes (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface CVUploadProps {
  /** Callback when upload is complete */
  onUploadComplete?: (fileName: string) => void;
  /** API endpoint for uploading CV */
  uploadEndpoint?: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * CVUpload component for handling CV/resume file uploads
 * with success message integration and state management.
 */
export const CVUpload: React.FC<CVUploadProps> = ({
  onUploadComplete,
  uploadEndpoint = '/api/cv/upload',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Use the upload status hook to manage upload states
  const { uploadState, setSuccess, setProcessing, setError, reset } = useUploadStatus();

  /**
   * Validates the selected file
   */
  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a PDF or Word document.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit.';
    }
    return null;
  };

  /**
   * Handles the file upload to the API
   */
  const uploadFile = async (file: File): Promise<void> => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    reset(); // Reset any previous state

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed. Please try again.');
      }

      const data = await response.json();

      // Check if backend indicates processing is pending
      if (data.processingPending || data.status === 'processing') {
        setProcessing(file.name);
      } else {
        setSuccess(file.name);
      }

      onUploadComplete?.(file.name);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handles file input change event
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    // Reset input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handles drag over event
   */
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  /**
   * Handles drag leave event
   */
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  /**
   * Handles file drop event
   */
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, []);

  /**
   * Triggers file input click
   */
  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  /**
   * Handles dismissing the success message
   */
  const handleDismiss = (): void => {
    reset();
  };

  // Determine if success message should be shown
  const showSuccessMessage = uploadState.status === 'success' || uploadState.status === 'processing';

  return (
    <div className={`cv-upload ${className}`}>
      {/* Render success message when status is 'success' or 'processing' */}
      {showSuccessMessage && (
        <UploadSuccessMessage
          fileName={uploadState.fileName || ''}
          processingPending={uploadState.status === 'processing'}
          showNextSteps={uploadState.status === 'success'}
          onDismiss={handleDismiss}
        />
      )}

      {/* Only show upload area when not showing success message */}
      {!showSuccessMessage && (
        <>
          <div
            className={`cv-upload__dropzone ${isDragging ? 'cv-upload__dropzone--dragging' : ''} ${isUploading ? 'cv-upload__dropzone--uploading' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
            aria-label="Upload CV"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="cv-upload__input"
              aria-hidden="true"
            />

            {isUploading ? (
              <div className="cv-upload__loading">
                <span className="cv-upload__spinner" aria-hidden="true" />
                <p>Uploading...</p>
              </div>
            ) : (
              <div className="cv-upload__content">
                <svg
                  className="cv-upload__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="cv-upload__text">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="cv-upload__hint">PDF or Word document (max 5MB)</p>
              </div>
            )}
          </div>

          {/* Show error message when status is 'error' */}
          {uploadState.status === 'error' && uploadState.errorMessage && (
            <div className="cv-upload__error" role="alert">
              <span className="cv-upload__error-icon" aria-hidden="true">⚠️</span>
              <span>{uploadState.errorMessage}</span>
              <button
                type="button"
                className="cv-upload__error-dismiss"
                onClick={reset}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CVUpload;
