import React, { useCallback, useRef } from 'react';
import { useUploadStatus } from '../../hooks/useUploadStatus';
import { CVUploadSuccess } from './CVUploadSuccess';

/**
 * Props for the CVUpload component
 */
interface CVUploadProps {
  /** Callback fired when upload completes successfully */
  onUploadComplete?: (fileName: string) => void;
  /** API endpoint for CV upload */
  uploadEndpoint?: string;
  /** Accepted file types */
  acceptedTypes?: string;
  /** Maximum file size in bytes */
  maxFileSize?: number;
}

/**
 * CV Upload component with success/error state management
 * Handles file selection, upload to API, and displays success message
 */
export const CVUpload: React.FC<CVUploadProps> = ({
  onUploadComplete,
  uploadEndpoint = '/api/cv/upload',
  acceptedTypes = '.pdf,.doc,.docx',
  maxFileSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadStatus, setUploading, setSuccess, setError, reset } = useUploadStatus();

  /**
   * Handles file selection and upload
   */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      
      if (!file) {
        return;
      }

      // Validate file size
      if (file.size > maxFileSize) {
        setError(`File size exceeds maximum allowed size of ${maxFileSize / (1024 * 1024)}MB`);
        return;
      }

      // Set uploading state before starting upload
      setUploading();

      try {
        const formData = new FormData();
        formData.append('cv', file);

        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Upload failed with status ${response.status}`);
        }

        // Set success state with file name on successful API response
        setSuccess(file.name);
        onUploadComplete?.(file.name);
      } catch (error) {
        // Set error state on failure
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during upload';
        setError(errorMessage);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [uploadEndpoint, maxFileSize, setUploading, setSuccess, setError, onUploadComplete]
  );

  /**
   * Handles dismissing the success message
   */
  const handleDismiss = useCallback(() => {
    reset();
  }, [reset]);

  /**
   * Triggers file input click
   */
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="cv-upload">
      {/* Render success message conditionally when status is 'success' */}
      {uploadStatus.status === 'success' && uploadStatus.fileName && (
        <CVUploadSuccess
          fileName={uploadStatus.fileName}
          onDismiss={handleDismiss}
        />
      )}

      {/* Error message display */}
      {uploadStatus.status === 'error' && uploadStatus.error && (
        <div className="cv-upload__error" role="alert">
          <span className="cv-upload__error-message">{uploadStatus.error}</span>
          <button
            type="button"
            className="cv-upload__error-dismiss"
            onClick={reset}
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      )}

      {/* Upload area - hidden when showing success */}
      {uploadStatus.status !== 'success' && (
        <div className="cv-upload__dropzone">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileChange}
            className="cv-upload__input"
            aria-label="Upload CV file"
            disabled={uploadStatus.status === 'uploading'}
          />
          
          <button
            type="button"
            className="cv-upload__button"
            onClick={handleUploadClick}
            disabled={uploadStatus.status === 'uploading'}
          >
            {uploadStatus.status === 'uploading' ? (
              <>
                <span className="cv-upload__spinner" aria-hidden="true" />
                Uploading...
              </>
            ) : (
              'Select CV to Upload'
            )}
          </button>
          
          <p className="cv-upload__hint">
            Accepted formats: PDF, DOC, DOCX (max {maxFileSize / (1024 * 1024)}MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default CVUpload;
