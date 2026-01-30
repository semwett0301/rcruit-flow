/**
 * File upload validation utilities for CV/resume files.
 * Uses shared constants from @repo/dto for consistent validation across frontend and backend.
 */
import { BadRequestException } from '@nestjs/common';
import { CV_ACCEPTED_FORMATS, CV_VALIDATION_MESSAGES } from '@repo/dto';

/**
 * Options for customizing file validation behavior.
 */
export interface FileValidationOptions {
  /** List of allowed MIME types. Defaults to CV_ACCEPTED_FORMATS.mimeTypes */
  allowedMimeTypes?: string[];
  /** Maximum file size in bytes. Defaults to CV_ACCEPTED_FORMATS.maxSizeBytes */
  maxSizeBytes?: number;
}

/**
 * Validates a CV/resume file against format and size constraints.
 * Throws BadRequestException if validation fails.
 *
 * @param file - The uploaded file from Multer
 * @param options - Optional validation configuration
 * @throws BadRequestException if file is missing, has invalid format, or exceeds size limit
 */
export const validateCVFile = (
  file: Express.Multer.File,
  options?: FileValidationOptions
): void => {
  const allowedMimeTypes = options?.allowedMimeTypes || CV_ACCEPTED_FORMATS.mimeTypes;
  const maxSizeBytes = options?.maxSizeBytes || CV_ACCEPTED_FORMATS.maxSizeBytes;

  if (!file) {
    throw new BadRequestException(CV_VALIDATION_MESSAGES.uploadRequired);
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException(CV_VALIDATION_MESSAGES.invalidFormat);
  }

  if (file.size > maxSizeBytes) {
    throw new BadRequestException(CV_VALIDATION_MESSAGES.fileTooLarge);
  }
};

/**
 * Multer file filter function for CV uploads.
 * Use this with Multer's fileFilter option to reject invalid files early.
 *
 * @param req - Express request object
 * @param file - The uploaded file from Multer
 * @param callback - Multer callback to accept or reject the file
 */
export const cvFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void
): void => {
  if (!CV_ACCEPTED_FORMATS.mimeTypes.includes(file.mimetype)) {
    callback(new BadRequestException(CV_VALIDATION_MESSAGES.invalidFormat), false);
    return;
  }
  callback(null, true);
};
