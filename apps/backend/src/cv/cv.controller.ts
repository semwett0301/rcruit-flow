/**
 * CV Controller
 *
 * Handles CV-related HTTP endpoints including file upload functionality.
 * Uses file size limits from shared DTO constraints.
 */
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { CV_UPLOAD_CONSTRAINTS } from '@repo/dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  /**
   * Upload a CV file
   *
   * Accepts a CV file upload with size constraints defined in CV_UPLOAD_CONSTRAINTS,
   * and processes it through the CV service.
   *
   * @param file - The uploaded CV file
   * @returns Processed CV data from the service
   */
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: CV_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES,
      },
    }),
  )
  async uploadCv(@UploadedFile() file: Express.Multer.File) {
    return this.cvService.uploadCv(file);
  }
}
