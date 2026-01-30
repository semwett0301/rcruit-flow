/**
 * Message constants for the frontend application.
 * 
 * This module centralizes all user-facing message text content,
 * making it easier to maintain, update, and prepare for internationalization (i18n).
 */

/**
 * Success messages displayed after a successful CV/resume upload.
 */
export const UPLOAD_SUCCESS_MESSAGES = {
  /** Main title displayed on upload success */
  title: 'Upload Successful!',
  
  /** Subtitle providing immediate context about the upload */
  subtitle: 'Your CV has been received and is being processed.',
  
  /** Default list of next steps shown to the user after upload */
  defaultNextSteps: [
    'Our team will review your CV shortly',
    'You may receive follow-up questions via email',
    'Check your application status in your dashboard',
  ],
} as const;

/** Type for upload success messages */
export type UploadSuccessMessages = typeof UPLOAD_SUCCESS_MESSAGES;
