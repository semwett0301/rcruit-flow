/**
 * CV File Upload Decorator
 *
 * Custom decorator for handling CV file uploads with built-in validation.
 * Combines file interception with file type filtering and size limits.
 */
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CV_ACCEPTED_FORMATS } from '@repo/dto';
import { cvFileFilter } from '../validators/file-upload.validator';

/**
 * Decorator for CV file upload endpoints.
 *
 * Applies file interception with:
 * - File type validation (PDF, DOC, DOCX)
 * - File size limit based on CV_ACCEPTED_FORMATS configuration
 *
 * @param fieldName - The form field name for the CV file (default: 'cv')
 * @returns Combined decorators for file upload handling
 *
 * @example
 * ```typescript
 * @Post('upload')
 * @CVFileUpload('cv')
 * async uploadCV(@UploadedFile() file: Express.Multer.File) {
 *   // Handle uploaded CV file
 * }
 * ```
 */
export const CVFileUpload = (fieldName: string = 'cv') => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        fileFilter: cvFileFilter,
        limits: {
          fileSize: CV_ACCEPTED_FORMATS.maxSizeBytes,
        },
      }),
    ),
  );
};
