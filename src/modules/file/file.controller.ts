import {
  Controller,
  Post,
  BadRequestException,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';

import { ApiConfigService } from 'src/config/config.service';
import { getStorageDir } from './helper';
import * as fs from 'fs';
import stream from 'stream';
import * as util from 'util';
import path from 'path';
import { FileType } from './file.module';

@Controller('file')
export class FileController {
  constructor(private configService: ApiConfigService) {}
  @Post()
  async uploadFile(@Req() req) {
    if (!req.isMultipart()) {
      throw new BadRequestException('File is required');
    }
    const fileData = await req.file();

    if (!fileData) {
      throw new BadRequestException('File is required');
    }

    const fileName =
      fileData.fieldname + '-' + Date.now() + path.extname(fileData.filename);

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
}
