/**
 * CV Module
 *
 * This module provides CV-related functionality including file validation.
 * It exports the CvFileValidator for use in other modules.
 */
import { Module } from '@nestjs/common';
import { CvFileValidator } from './validators/cv-file.validator';

@Module({
  providers: [CvFileValidator],
  exports: [CvFileValidator],
})
export class CvModule {}
