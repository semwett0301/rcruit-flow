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
  onUploadComplete?: (file: File) => void;
  /** Accepted file types for upload */
  acceptedFileTypes?: string[];
  /** Maximum file size in megabytes */
  maxFileSizeMB?: number;
  /** Optional list of next steps to display after successful upload */
  nextSteps?: string[];
}

/**
 * CVUpload component handles file selection and upload for CV documents.
 * Displays a success message with optional next steps after successful upload.
 */
export const CVUpload: React.FC<CVUploadProps> = ({
  onUploadComplete,
  acceptedFileTypes = ['.pdf', '.doc', '.docx'],
  maxFileSizeMB = 10,
  nextSteps,
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
   * Handles the file upload process including validation and API call
   * @param event - The change event from file input
   */
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file size
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`File size exceeds ${maxFileSizeMB}MB limit`);
        return;
      }

      setUploading(file.name);

      try {
        // Perform actual upload API call
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
        onUploadComplete?.(file);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
      }
    },
    [maxFileSizeMB, setUploading, setSuccess, setError, onUploadComplete]
  );

  /**
   * Handles dismissing the success message and resetting state
   */
  const handleDismissSuccess = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="cv-upload">
      {isSuccess && uploadState.fileName && (
        <UploadSuccessMessage
          fileName={uploadState.fileName}
          onDismiss={handleDismissSuccess}
          nextSteps={nextSteps}
        />
      )}

      {!isSuccess && (
        <div className="cv-upload__dropzone">
          <input
            type="file"
            id="cv-file-input"
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cv-upload__input"
          />
          <label htmlFor="cv-file-input" className="cv-upload__label">
            {isUploading ? (
              <span>Uploading {uploadState.fileName}...</span>
            ) : (
              <>
                <span className="cv-upload__icon">📄</span>
                <span>Click to upload your CV</span>
                <span className="cv-upload__hint">
                  Accepted formats: {acceptedFileTypes.join(', ')} (max {maxFileSizeMB}MB)
                </span>
              </>
            )}
          </label>
        </div>
      )}

      {uploadState.errorMessage && (
        <div className="cv-upload__error" role="alert">
          {uploadState.errorMessage}
        </div>
      )}
    </div>
  );
};
