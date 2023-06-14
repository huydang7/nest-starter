import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from 'src/config/config.service';

import { FileController } from './file.controller';

export enum FileType {
  IMGS = 'imgs',
  FILE = 'files',
}

@Module({
  controllers: [FileController],
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.appConfig.uploadPath,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class FileModule {}
