/**
 * CV Upload Controller
 * 
 * Handles HTTP requests for CV file uploads with proper validation
 * and error response handling.
 */
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvUploadService } from './cv-upload.service';
import { CV_UPLOAD_CONSTRAINTS } from '@rcruit-flow/dto';

/**
 * Controller responsible for handling CV upload operations.
 * Provides endpoints for uploading CV files with proper validation
 * and comprehensive error handling.
 */
@Controller('cv')
export class CvUploadController {
  constructor(private readonly cvUploadService: CvUploadService) {}

  /**
   * Upload a CV file.
   * 
   * @param file - The uploaded CV file (PDF, DOC, DOCX)
   * @param req - The HTTP request object containing user information
   * @returns The result of the CV upload operation
   * @throws BadRequestException - When no file is provided
   * @throws PayloadTooLargeException - When file exceeds size limit
   * @throws UnsupportedMediaTypeException - When file type is not allowed
   */
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
      },
      fileFilter: (req, file, callback) => {
        // Validate file type
        const allowedMimeTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new UnsupportedMediaTypeException(
              `Invalid file type. Allowed types: PDF, DOC, DOCX. Received: ${file.mimetype}`
            ),
            false
          );
        }

        callback(null, true);
      },
    })
  )
  async uploadCv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    // Validate file presence
    if (!file) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No file provided. Please upload a CV file.',
        error: 'Bad Request',
      });
    }

    // Validate file size (additional check in case interceptor limit is bypassed)
    if (file.size > CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      throw new PayloadTooLargeException({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        message: `File size exceeds the maximum allowed size of ${CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
        error: 'Payload Too Large',
      });
    }

    // Validate file is not empty
    if (file.size === 0) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Uploaded file is empty. Please upload a valid CV file.',
        error: 'Bad Request',
      });
    }

    // Extract user ID from request (fallback to anonymous for unauthenticated uploads)
    const userId = req.user?.id || 'anonymous';

    try {
      const result = await this.cvUploadService.uploadCv(file, userId);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'CV uploaded successfully',
        data: result,
      };
    } catch (error) {
      // Re-throw known HTTP exceptions
      if (
        error instanceof BadRequestException ||
        error instanceof PayloadTooLargeException ||
        error instanceof UnsupportedMediaTypeException
      ) {
        throw error;
      }

      // Handle unexpected errors with a generic message
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Failed to upload CV. Please try again later.',
        error: 'Bad Request',
      });
    }
  }
}
