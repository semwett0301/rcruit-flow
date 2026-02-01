/**
 * CV Module
 *
 * This module organizes all CV-related functionality including
 * controllers, services, and exports for use by other modules.
 */
import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';

@Module({
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
