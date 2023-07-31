import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {} from '@nestjs/platform-fastify';
import * as fs from 'fs';
import path, { join } from 'path';
import { ConfigService } from 'src/config/config.service';
import stream from 'stream';
import * as util from 'util';

import { FileType } from './file.module';
import { getStorageDir } from './helper';

@Controller('file')
export class FileController {
  constructor(private configService: ConfigService) {}
  @Post()
  async uploadFile(@Req() req) {
    if (!req.isMultipart()) {
      throw new BadRequestException('File is required');
    }
    const fileData = await req.file();

    if (!fileData) {
      throw new BadRequestException('File is required');
    }

    const fileName = fileData.fieldname + '-' + Date.now() + path.extname(fileData.filename);

    const relativePath = await this.handler(fileData.file, fileName);

    return {
      url: `/file/${relativePath}`,
      absolutePath: `${this.configService.appConfig.hostUrl}/file/${relativePath}`,
    };
  }

  async handler(file: any, filename: string): Promise<string> {
    const pipeline = util.promisify(stream.pipeline);
    const filePath = `${getStorageDir(FileType.IMGS)}/${filename}`;
    const writeStream = fs.createWriteStream(filePath);

    try {
      await pipeline(file, writeStream);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Cant upload');
    }
    return filePath;
  }

  @Get('upload/:year/:month/imgs/:fileName')
  getFile(@Param() params: any, @Res() res) {
    const { year, month, fileName } = params;

    return res.sendFile(
      fileName,
      join(process.cwd(), this.configService.appConfig.uploadPath, year, month, 'imgs')
    );
  }
}
