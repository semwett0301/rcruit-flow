/**
 * CVUpload Component
 * 
 * A file upload component for CV/resume files with format validation,
 * file format hints, and error handling.
 */
import React, { useState, useRef } from 'react';
import { FileFormatHint } from '../common/FileFormatHint';
import { validateCVFile, getAcceptAttribute } from '../../utils/fileValidation';
import { CV_VALIDATION_MESSAGES } from '@repo/dto';

interface CVUploadProps {
  /** Callback fired when a valid file is selected */
  onFileSelect: (file: File) => void;
  /** Optional callback fired when validation fails */
  onError?: (error: string) => void;
}

/**
 * CV Upload component with file validation and format hints.
 * 
 * Validates file type and size before accepting the upload.
 * Displays helpful format hints and error messages to guide users.
 * 
 * @example
 * ```tsx
 * <CVUpload
 *   onFileSelect={(file) => handleUpload(file)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export const CVUpload: React.FC<CVUploadProps> = ({ onFileSelect, onError }) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles file input change events.
   * Validates the selected file and updates component state accordingly.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (!file) {
      return;
    }
    
    const validation = validateCVFile(file);
    
    if (!validation.isValid) {
      const errorMessage = validation.error || CV_VALIDATION_MESSAGES.invalidFormat;
      setError(errorMessage);
      onError?.(errorMessage);
      
      // Reset the file input to allow re-selecting the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="cv-upload">
      <label className="cv-upload__label">
        Upload CV
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptAttribute()}
          onChange={handleFileChange}
          className="cv-upload__input"
          aria-describedby="cv-upload-hint cv-upload-error"
        />
      </label>
      
      <FileFormatHint 
        className="cv-upload__hint" 
        id="cv-upload-hint"
      />
      
      {error && (
        <div 
          className="cv-upload__error" 
          role="alert"
          id="cv-upload-error"
        >
          {error}
        </div>
      )}
      
      {selectedFile && !error && (
        <div className="cv-upload__success">
          Selected: {selectedFile.name}
        </div>
      )}
    </div>
  );
};

export default CVUpload;
