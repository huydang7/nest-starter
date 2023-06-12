import { Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ApiConfigService } from 'src/config/config.service';
import { ConfigModule } from '@nestjs/config';

export enum FileType {
  IMGS = 'imgs',
  FILE = 'files',
}

@Module({
  controllers: [FileController],
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ApiConfigService) => ({
        dest: configService.appConfig.uploadPath,
      }),
      inject: [ApiConfigService],
    }),
  ],
})
export class FileModule {}
