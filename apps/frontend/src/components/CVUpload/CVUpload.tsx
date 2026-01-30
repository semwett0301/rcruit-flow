/**
 * CVUpload Component
 *
 * A file upload component for CV/resume files that integrates with
 * the upload success hook and displays success messages upon completion.
 */
import React, { useState, useCallback } from 'react';
import { UploadSuccessMessage } from '../UploadSuccessMessage';
import { useUploadSuccess } from '../../hooks/useUploadSuccess';
import './CVUpload.css';

export interface CVUploadProps {
  /** Callback fired when upload completes successfully */
  onUploadComplete?: (file: File) => void;
  /** Callback fired when upload encounters an error */
  onUploadError?: (error: Error) => void;
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
  onUploadError,
  acceptedFileTypes = ['.pdf', '.doc', '.docx'],
  maxFileSizeMB = 10,
  nextSteps,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSuccess, fileName, showSuccess, dismissSuccess, resetSuccess } = useUploadSuccess();

  /**
   * Validates the file before upload
   * @param file - The file to validate
   * @returns Error message if invalid, null if valid
   */
  const validateFile = useCallback(
    (file: File): string | null => {
      // Validate file size
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        return `File size exceeds ${maxFileSizeMB}MB limit`;
      }

      // Validate file type
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!acceptedFileTypes.includes(fileExtension)) {
        return `Invalid file type. Accepted formats: ${acceptedFileTypes.join(', ')}`;
      }

      return null;
    },
    [maxFileSizeMB, acceptedFileTypes]
  );

  /**
   * Handles the file upload process including validation and API call
   * @param file - The file to upload
   */
  const handleFileUpload = useCallback(
    async (file: File) => {
      // Validate file first
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        onUploadError?.(new Error(validationError));
        return;
      }

      setIsUploading(true);
      setError(null);
      resetSuccess();

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

        showSuccess(file.name);
        onUploadComplete?.(file);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.';
        setError(errorMessage);
        onUploadError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setIsUploading(false);
      }
    },
    [validateFile, showSuccess, resetSuccess, onUploadComplete, onUploadError]
  );

  /**
   * Handles file input change event
   * @param event - The change event from file input
   */
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
      // Reset input value to allow re-uploading the same file
      event.target.value = '';
    },
    [handleFileUpload]
  );

  /**
   * Handles dismissing the success message
   */
  const handleDismissSuccess = useCallback(() => {
    dismissSuccess();
  }, [dismissSuccess]);

  return (
    <div className="cv-upload-container">
      {isSuccess && (
        <UploadSuccessMessage
          fileName={fileName || undefined}
          onDismiss={handleDismissSuccess}
          nextSteps={nextSteps}
        />
      )}

      {error && (
        <div className="cv-upload-error" role="alert">
          {error}
        </div>
      )}

      {!isSuccess && (
        <div className="cv-upload-dropzone">
          <input
            type="file"
            id="cv-file-input"
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileChange}
            disabled={isUploading}
            className="cv-upload-input"
            aria-describedby="cv-upload-hint"
          />
          <label htmlFor="cv-file-input" className="cv-upload-label">
            {isUploading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <span className="cv-upload-icon">📄</span>
                <span>Click or drag to upload your CV</span>
                <span id="cv-upload-hint" className="cv-upload-hint">
                  Accepted formats: {acceptedFileTypes.join(', ')} (max {maxFileSizeMB}MB)
                </span>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
};

export default CVUpload;
