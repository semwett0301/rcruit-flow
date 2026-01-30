/**
 * CVUpload Component
 * 
 * A file upload component for CV/resume files that integrates with
 * the upload status hook and displays success messages upon completion.
 */
import React, { useCallback } from 'react';
import { UploadSuccessMessage } from '../UploadSuccessMessage';
import { useUploadStatus } from '../../hooks/useUploadStatus';
import './CVUpload.css';

export interface CVUploadProps {
  /** Callback fired when upload completes successfully */
  onUploadComplete?: (fileName: string) => void;
  /** Optional list of next steps to display after successful upload */
  nextSteps?: string[];
}

/**
 * CVUpload component handles file selection and upload for CV documents.
 * Displays a success message with optional next steps after successful upload.
 */
export const CVUpload: React.FC<CVUploadProps> = ({
  onUploadComplete,
  nextSteps
}) => {
  const {
    uploadState,
    setUploading,
    setSuccess,
    setError,
    reset,
    isSuccess,
    isUploading,
  } = useUploadStatus();

  /**
   * Handles the file upload process
   * @param file - The file to upload
   */
  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(file.name);
    
    try {
      const formData = new FormData();
      formData.append('cv', file);
      
      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      setSuccess(file.name);
      onUploadComplete?.(file.name);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    }
  }, [setUploading, setSuccess, setError, onUploadComplete]);

  /**
   * Handles file input change event
   * @param event - The change event from file input
   */
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  /**
   * Handles dismissing the success message and resetting state
   */
  const handleDismissSuccess = useCallback(() => {
    reset();
  }, [reset]);

  // Show success message when upload is complete
  if (isSuccess) {
    return (
      <UploadSuccessMessage
        fileName={uploadState.fileName || undefined}
        onDismiss={handleDismissSuccess}
        nextSteps={nextSteps}
      />
    );
  }

  return (
    <div className="cv-upload">
      <label className="cv-upload__label">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          disabled={isUploading}
          className="cv-upload__input"
        />
        <span className="cv-upload__button">
          {isUploading ? 'Uploading...' : 'Select CV to Upload'}
        </span>
      </label>
    </div>
  );
};
