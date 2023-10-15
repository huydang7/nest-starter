import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
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
    if (fileData.file.truncated) {
      fs.unlinkSync(relativePath);
      throw new BadRequestException('File is too large');
    }
    return {
      url: `/${relativePath}`,
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
      throw new InternalServerErrorException('Cant upload');
    }
    return filePath;
  }

  @Get(':path/*')
  getFileFullPath(@Req() req, @Res() res) {
    const fullPath = req.params.path + '/' + req.params['*'];
    const fileName = fullPath.split('/').pop();
    return res.sendFile(fileName, join(process.cwd(), fullPath.split(fileName)[0]));
  }
}
