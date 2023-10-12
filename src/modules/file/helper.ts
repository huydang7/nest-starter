import dayjs from 'dayjs';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import path from 'path';
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

export const storage = diskStorage({
  destination: (req, _, cb) => {
    const uploadSource = req.query.uploadSource as FileType | undefined;
    const storageDir = getStorageDir(uploadSource);
    cb(null, storageDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
