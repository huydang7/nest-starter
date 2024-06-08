import { Controller, Get, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';

import { ConfigService } from '@/config/config.service';

import { storage } from './helper';

@Controller('file')
export class FileController {
  constructor(private configService: ConfigService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storage,
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return {
      url: `/${file.path}`,
      absolutePath: `${this.configService.appConfig.hostUrl}/file/${file.path}`,
    };
  }

  @Get(':path/*')
  getFileFullPath(@Req() req, @Res() res: Response) {
    const fullPath = req.params.path + '/' + req.params[0];
    return res.sendFile(join(process.cwd(), fullPath));
  }
}
