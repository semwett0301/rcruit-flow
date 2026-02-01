/**
 * CV Module
 *
 * This module organizes all CV-related functionality including
 * upload controllers, services, and exports for use by other modules.
 */
import { Module } from '@nestjs/common';
import { CvUploadController } from './cv-upload.controller';
import { CvUploadService } from './cv-upload.service';

@Module({
  controllers: [CvUploadController],
  providers: [CvUploadService],
  exports: [CvUploadService],
})
export class CvModule {}
