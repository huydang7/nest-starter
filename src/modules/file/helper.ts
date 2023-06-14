import dayjs from 'dayjs';
import { existsSync, mkdirSync } from 'fs';
import { configService } from 'src/config/config.service';

import { FileType } from './file.module';

const checkAndCreateDir = async (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, {
      recursive: true,
    });
  }
};

export const getStorageDir = (uploadSource: FileType = FileType.IMGS) => {
  const uploadPath = `${configService.appConfig.uploadPath}/${dayjs().year()}/${
    dayjs().month() + 1
  }/${uploadSource}`;
  checkAndCreateDir(uploadPath);
  return uploadPath;
};
