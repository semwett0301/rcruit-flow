/**
 * CV Controller
 *
 * Handles CV-related HTTP endpoints including file upload functionality.
 * Uses validation pipe to ensure uploaded files meet requirements.
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
import { CvFileValidationPipe } from './validators/cv-file.validator';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  /**
   * Upload a CV file
   *
   * Accepts a CV file upload, validates it using CvFileValidationPipe,
   * and processes it through the CV service.
   *
   * @param file - The uploaded CV file (validated by CvFileValidationPipe)
   * @returns Object containing success status, processed data, and message
   */
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('cv'))
  async uploadCv(
    @UploadedFile(CvFileValidationPipe) file: Express.Multer.File,
  ) {
    const result = await this.cvService.processUpload(file);
    return {
      success: true,
      data: result,
      message: 'CV uploaded successfully',
    };
  }
}
