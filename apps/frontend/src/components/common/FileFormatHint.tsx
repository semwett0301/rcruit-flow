/**
 * FileFormatHint Component
 *
 * A reusable component to display accepted file format information
 * near upload areas. Shows supported formats and maximum file size.
 */
import React from 'react';
import { CV_ACCEPTED_FORMATS } from '@repo/dto';

interface FileFormatHintProps {
  /** Optional CSS class name for custom styling */
  className?: string;
}

/**
 * Displays accepted file formats and size limits for file uploads.
 *
 * @param props - Component props
 * @param props.className - Optional additional CSS class name
 * @returns JSX element showing file format hints
 *
 * @example
 * ```tsx
 * <FileFormatHint />
 * <FileFormatHint className="my-custom-class" />
 * ```
 */
export const FileFormatHint: React.FC<FileFormatHintProps> = ({ className }) => {
  return (
    <div className={`file-format-hint ${className || ''}`.trim()}>
      <span className="file-format-hint__label">Accepted formats:</span>
      <span className="file-format-hint__formats">{CV_ACCEPTED_FORMATS.displayText}</span>
      <span className="file-format-hint__size">(Max size: {CV_ACCEPTED_FORMATS.maxSizeDisplay})</span>
    </div>
  );
};

export default FileFormatHint;
