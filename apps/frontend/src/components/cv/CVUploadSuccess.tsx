/**
 * CVUploadSuccess Component
 * 
 * A CV-specific success message component that wraps SuccessMessage
 * with CV upload context to display confirmation after successful upload.
 */

import React from 'react';
import SuccessMessage from '../SuccessMessage';

/**
 * Props for the CVUploadSuccess component
 */
interface CVUploadSuccessProps {
  /** Name of the uploaded CV file */
  fileName: string;
  /** Whether the success message is visible */
  visible: boolean;
  /** Callback function to dismiss the success message */
  onDismiss: () => void;
}

/**
 * CVUploadSuccess displays a success message after a CV has been
 * successfully uploaded and processed.
 * 
 * @param props - Component props
 * @returns The rendered success message component
 */
const CVUploadSuccess: React.FC<CVUploadSuccessProps> = ({
  fileName,
  visible,
  onDismiss,
}) => {
  return (
    <SuccessMessage
      title="CV Uploaded Successfully!"
      message={`Your CV "${fileName}" has been received and processed.`}
      nextSteps="Our team will review your application and get back to you soon."
      visible={visible}
      onDismiss={onDismiss}
    />
  );
};

export default CVUploadSuccess;
