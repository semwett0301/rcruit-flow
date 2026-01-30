import React, { useState, useCallback } from 'react';
import { SuccessMessage } from './SuccessMessage';
import { useUploadSuccess } from '../hooks/useUploadSuccess';

/**
 * CVUpload Component
 * Handles CV file upload with success message integration
 */
export const CVUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { showSuccess, triggerSuccess, dismissSuccess } = useUploadSuccess();

  /**
   * Handle file selection
   */
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  /**
   * Handle CV upload submission
   */
  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed. Please try again.');
      }

      // Only trigger success on successful upload
      triggerSuccess(file.name);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('cv-file-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      // Set error state - do not show success message on errors
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  }, [file, triggerSuccess]);

  return (
    <div className="cv-upload-container">
      <h2>Upload Your CV</h2>
      
      <div className="upload-form">
        <input
          id="cv-file-input"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        {file && (
          <p className="selected-file">
            Selected: {file.name}
          </p>
        )}
        
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="upload-button"
        >
          {isUploading ? 'Uploading...' : 'Upload CV'}
        </button>
      </div>

      {/* Success message - only rendered when upload succeeds */}
      <SuccessMessage
        visible={showSuccess}
        title="CV Uploaded Successfully!"
        message="Your CV has been received and processed successfully."
        nextSteps="Our team will review your application and contact you within 3-5 business days."
        onDismiss={dismissSuccess}
      />
    </div>
  );
};

export default CVUpload;
