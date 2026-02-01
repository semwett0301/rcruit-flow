/**
 * CvUpload Component
 *
 * Main CV upload component that integrates file selection, upload functionality,
 * error handling, and success states. Provides a complete user experience for
 * uploading CV/resume files.
 */

import React, { useRef, useState } from 'react';
import { useCvUpload } from '../../hooks/useCvUpload';
import { CvUploadError } from './CvUploadError';
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

/**
 * Props for the CvUpload component
 */
interface CvUploadProps {
  /** Callback fired when upload completes successfully */
  onUploadSuccess?: (result: { id: string; filename: string }) => void;
}

/**
 * CV Upload component with integrated error handling and success states.
 *
 * Features:
 * - File selection with format validation
 * - Upload progress indication
 * - Error display with retry capability
 * - Success confirmation with option to upload another
 *
 * @param props - Component props
 * @returns The CvUpload component
 */
export const CvUpload: React.FC<CvUploadProps> = ({ onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isUploading, error, success, uploadCv, clearError, reset } = useCvUpload();

  /**
   * Handles file selection from the input element
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      clearError();
    }
  };

  /**
   * Initiates the CV upload process
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadCv(selectedFile);
    if (result && onUploadSuccess) {
      onUploadSuccess(result);
    }
  };

  /**
   * Retries the upload after an error
   */
  const handleRetry = () => {
    clearError();
    if (selectedFile) {
      handleUpload();
    }
  };

  /**
   * Resets the component to its initial state
   */
  const handleReset = () => {
    reset();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const acceptedFormats = CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(',');

  return (
    <div className="cv-upload">
      <div className="cv-upload__dropzone">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileSelect}
          disabled={isUploading}
          aria-describedby="cv-upload-help"
        />
        <p id="cv-upload-help" className="cv-upload__help">
          Accepted formats: {CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')} (max {CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB)
        </p>
      </div>

      {selectedFile && !error && (
        <div className="cv-upload__selected">
          <span>{selectedFile.name}</span>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload CV'}
          </button>
        </div>
      )}

      {error && (
        <CvUploadError
          error={error}
          onRetry={handleRetry}
          onDismiss={handleReset}
        />
      )}

      {success && (
        <div className="cv-upload__success" role="status">
          <p>Your CV has been uploaded successfully!</p>
          <button type="button" onClick={handleReset}>
            Upload Another
          </button>
        </div>
      )}
    </div>
  );
};

export default CvUpload;
