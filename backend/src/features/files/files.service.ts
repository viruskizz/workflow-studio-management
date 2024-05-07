import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  rootPath = 'public/';
  constructor() {}

  list() {
    return {
      path: '',
      files: [],
    };
  }

  save(path: string, file: Express.Multer.File) {
    const fullpath = this.rootPath + path;
    if (!fs.existsSync(fullpath)) {
      fs.mkdirSync(fullpath, { recursive: true });
    }
    fs.writeFileSync(fullpath, Buffer.from(file.buffer));
    const imageUrl = `${process.env.NESTJS_URL}:${process.env.NESTJS_PORT}/{path}`;
  }

  readMetadata(path: string) {
    return {};
  }
}
