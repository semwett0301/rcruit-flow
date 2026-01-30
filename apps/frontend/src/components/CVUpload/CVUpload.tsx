/**
 * CVUpload Component
 *
 * A file upload component for CV/resume files with format validation,
 * helper text documentation, and success message display.
 */
import React, { useState, useRef, useCallback } from 'react';
import { validateCVFile, getAcceptAttribute, FileValidationResult } from '../../utils/file-validation';
import { CVUploadHelperText } from './CVUploadHelperText';
import { UploadSuccessMessage } from '../UploadSuccessMessage';
import { useUploadSuccess } from '../../hooks/useUploadSuccess';
import './CVUpload.css';

export interface CVUploadProps {
  /** Callback fired when a valid file is selected */
  onFileSelect?: (file: File) => void;
  /** Callback fired when upload completes successfully */
  onUploadComplete?: (file: File) => void;
  /** Callback fired when validation or upload encounters an error */
  onError?: (error: string) => void;
  /** Optional list of next steps to display after successful upload */
  nextSteps?: string[];
  /** Whether to auto-upload after file selection (default: true) */
  autoUpload?: boolean;
}

/**
 * CVUpload component handles file selection, validation, and upload for CV documents.
 * Uses centralized file validation utilities and displays format documentation via helper text.
 * Shows a success message with optional next steps after successful upload.
 */
export const CVUpload: React.FC<CVUploadProps> = ({
  onFileSelect,
  onUploadComplete,
  onError,
  nextSteps,
  autoUpload = true,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isSuccess, fileName, showSuccess, dismissSuccess, resetSuccess } = useUploadSuccess();

  /**
   * Handles the file upload process to the API
   * @param file - The validated file to upload
   */
  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError(null);
      resetSuccess();

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

        showSuccess(file.name);
        onUploadComplete?.(file);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [showSuccess, resetSuccess, onUploadComplete, onError]
  );

  /**
   * Handles file input change event with validation
   * @param event - The change event from file input
   */
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Use centralized file validation
      const validation: FileValidationResult = validateCVFile(file);

      if (!validation.isValid) {
        const errorMessage = validation.error || 'Invalid file';
        setError(errorMessage);
        setSelectedFile(null);
        onError?.(errorMessage);
        // Reset input value to allow re-selecting the same file
        event.target.value = '';
        return;
      }

      setError(null);
      setSelectedFile(file);
      onFileSelect?.(file);

      // Auto-upload if enabled
      if (autoUpload) {
        handleFileUpload(file);
      }

      // Reset input value to allow re-uploading the same file
      event.target.value = '';
    },
    [onFileSelect, onError, autoUpload, handleFileUpload]
  );

  /**
   * Handles dismissing the success message
   */
  const handleDismissSuccess = useCallback(() => {
    dismissSuccess();
    setSelectedFile(null);
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
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      )}

      {!isSuccess && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload your CV
          </label>

          <CVUploadHelperText className="mb-3" />

          <div className="cv-upload-dropzone">
            <input
              ref={fileInputRef}
              type="file"
              id="cv-file-input"
              accept={getAcceptAttribute()}
              onChange={handleFileChange}
              disabled={isUploading}
              className="cv-upload-input block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              aria-describedby="cv-upload-hint"
            />
            <label htmlFor="cv-file-input" className="cv-upload-label">
              {isUploading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <span className="cv-upload-icon">📄</span>
                  <span>Click or drag to upload your CV</span>
                </>
              )}
            </label>
          </div>

          {selectedFile && !isUploading && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {selectedFile.name}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default CVUpload;
