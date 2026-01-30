/**
 * CVUploadHelperText Component
 *
 * Displays helper text with accepted file formats and size limits
 * for the CV upload area.
 */
import React from 'react';
import { CV_ACCEPTED_FORMATS } from '@repo/dto';

interface CVUploadHelperTextProps {
  /** Optional CSS class name for styling */
  className?: string;
}

/**
 * Helper text component that displays accepted file formats and maximum
 * file size information near the CV upload area.
 */
export const CVUploadHelperText: React.FC<CVUploadHelperTextProps> = ({ className }) => {
  return (
    <div className={className}>
      <p className="text-sm text-gray-600">
        Accepted formats: {CV_ACCEPTED_FORMATS.displayText}
      </p>
      <p className="text-xs text-gray-500">
        Maximum file size: {CV_ACCEPTED_FORMATS.maxSizeDisplay}
      </p>
    </div>
  );
};

export default CVUploadHelperText;
