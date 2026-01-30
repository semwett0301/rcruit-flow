/**
 * File Upload Validation Utilities
 *
 * This module provides validation utilities for file uploads,
 * specifically for CV/resume files. It uses shared constants from
 * the DTO package to ensure consistency across frontend and backend.
 */

import { BadRequestException } from '@nestjs/common';
import { CV_ACCEPTED_FORMATS, CV_VALIDATION_MESSAGES } from '@repo/dto';

/**
 * Options for file validation
 */
export interface FileValidationOptions {
  /** Maximum file size in bytes */
  maxSize?: number;
  /** List of allowed MIME types */
  allowedMimeTypes?: string[];
  /** List of allowed file extensions (including the dot, e.g., '.pdf') */
  allowedExtensions?: string[];
}

/**
 * Validates a CV/resume file against size, MIME type, and extension constraints.
 *
 * @param file - The uploaded file from Multer
 * @param options - Optional validation options to override defaults
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * validateCVFile(uploadedFile);
 * // or with custom options
 * validateCVFile(uploadedFile, { maxSize: 5 * 1024 * 1024 });
 * ```
 */
export const validateCVFile = (
  file: Express.Multer.File,
  options?: FileValidationOptions
): void => {
  const maxSize = options?.maxSize ?? CV_ACCEPTED_FORMATS.maxSizeBytes;
  const allowedMimeTypes = options?.allowedMimeTypes ?? CV_ACCEPTED_FORMATS.mimeTypes;
  const allowedExtensions = options?.allowedExtensions ?? CV_ACCEPTED_FORMATS.extensions;

  // Validate mime type
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException(CV_VALIDATION_MESSAGES.invalidFormat);
  }

  // Validate extension
  const fileExtension = '.' + file.originalname.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    throw new BadRequestException(CV_VALIDATION_MESSAGES.invalidFormat);
  }

  // Validate size
  if (file.size > maxSize) {
    throw new BadRequestException(CV_VALIDATION_MESSAGES.fileTooLarge);
  }
};

/**
 * Multer file filter function for CV uploads.
 *
 * This function can be used directly with Multer's fileFilter option
 * to filter files before they are fully uploaded.
 *
 * @param req - The Express request object
 * @param file - The file being uploaded
 * @param callback - Callback to accept or reject the file
 *
 * @example
 * ```typescript
 * @UseInterceptors(
 *   FileInterceptor('cv', {
 *     fileFilter: cvFileFilter,
 *     limits: { fileSize: CV_ACCEPTED_FORMATS.maxSizeBytes },
 *   })
 * )
 * ```
 */
export const cvFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void
): void => {
  const allowedMimeTypes = CV_ACCEPTED_FORMATS.mimeTypes;
  const allowedExtensions = CV_ACCEPTED_FORMATS.extensions;

  const fileExtension = '.' + file.originalname.split('.').pop()?.toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    callback(null, true);
  } else {
    callback(new BadRequestException(CV_VALIDATION_MESSAGES.invalidFormat), false);
  }
};
