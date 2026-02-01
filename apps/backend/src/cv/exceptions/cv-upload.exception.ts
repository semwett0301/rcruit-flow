/**
 * Custom exception classes for CV upload failures.
 * These exceptions provide structured error responses for various CV upload error scenarios.
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  CvUploadErrorCode,
  CvUploadErrorResponse,
  CV_UPLOAD_CONSTRAINTS,
} from '@repo/dto';

/**
 * Base exception class for CV upload errors.
 * Extends NestJS HttpException to provide structured error responses.
 */
export class CvUploadException extends HttpException {
  constructor(errorResponse: CvUploadErrorResponse, status: HttpStatus) {
    super(errorResponse, status);
  }
}

/**
 * Exception thrown when an uploaded file has an invalid/unsupported file type.
 */
export class InvalidFileTypeException extends CvUploadException {
  constructor(currentType: string) {
    super(
      {
        code: CvUploadErrorCode.INVALID_FILE_TYPE,
        message: 'Invalid file type',
        details: {
          allowedTypes: CV_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
          currentType,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown when an uploaded file exceeds the maximum allowed size.
 */
export class FileSizeExceededException extends CvUploadException {
  constructor(currentSize: number) {
    super(
      {
        code: CvUploadErrorCode.FILE_SIZE_EXCEEDED,
        message: 'File size exceeded',
        details: {
          maxSize: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB,
          currentSize: Math.round(currentSize / (1024 * 1024)),
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown when an uploaded file appears to be corrupted or unreadable.
 */
export class FileCorruptedException extends CvUploadException {
  constructor() {
    super(
      {
        code: CvUploadErrorCode.FILE_CORRUPTED,
        message: 'File appears to be corrupted or unreadable',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exception thrown when a server error occurs during the CV upload process.
 */
export class CvServerErrorException extends CvUploadException {
  constructor() {
    super(
      {
        code: CvUploadErrorCode.SERVER_ERROR,
        message: 'Server error during upload',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
