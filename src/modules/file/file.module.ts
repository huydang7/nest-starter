import { Module } from '@nestjs/common';

import { FileController } from './file.controller';

export enum FileType {
  IMGS = 'imgs',
  FILE = 'files',
}

@Module({
  controllers: [FileController],
})
export class FileModule {}
