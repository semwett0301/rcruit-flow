import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ExtractCvDataDto } from '@/application/cv/dto/request/extract-cv-data.dto';
import { UploadFileDto } from '@/application/cv/dto/request/upload-file.dto';
import { UploadFileResponseDto } from '@/application/cv/dto/response/upload-file-response.dto';
import { ExtractCvContentUseCase } from '@/application/cv/use-case/extract-cv-content.use-case';
import { SaveCvUseCase } from '@/application/cv/use-case/save-cv.use-case';

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
  async extractCvData(@Body() dto: ExtractCvDataDto) {
    return await this.extractCvContentUseCase.extractData(dto);
  }
}
