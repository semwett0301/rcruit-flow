import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { ExtractCvContentUseCase } from 'application/cv/use-case/extract-cv-content.use-case';
import { SaveCvUseCase } from 'application/cv/use-case/save-cv.use-case';
import {
  ExtractCvDataDto,
  ExtractCvDataResultDto,
  UploadFileDto,
  UploadFileResponseDto,
} from './cvs.dto';

@Controller('cvs')
export class CvsController {
  constructor(
    private readonly extractCvContentUseCase: ExtractCvContentUseCase,
    private readonly saveCvUseCase: SaveCvUseCase,
  ) {}

  @Post('save')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    const fileKey = await this.saveCvUseCase.saveCV(file);

    return {
      message: 'File uploaded',
      key: fileKey,
    };
  }

  @Post('extract')
  @ApiBody({ type: ExtractCvDataDto })
  @ApiResponse({ type: ExtractCvDataResultDto })
  async extractCvData(
    @Body() dto: ExtractCvDataDto,
  ): Promise<ExtractCvDataResultDto> {
    return await this.extractCvContentUseCase.extractData(dto);
  }
}
