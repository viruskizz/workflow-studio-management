import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateFileDto } from './dto/upload-file.dto';
import { Repository } from 'typeorm';
import { FileEntity } from '../../typeorm/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  public readonly rootPath = 'public';
  public readonly serverUrl = `${this.configService.get('NESTJS_URL')}:${this.configService.get('NESTJS_PORT')}`;

  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
    private configService: ConfigService,
  ) {}

  list() {
    return {
      path: '',
      files: [],
    };
  }

  save(file: Express.Multer.File, body: CreateFileDto) {
    const filename = this.saveFile(file, body);
    return this.saveRecord(file, body).catch((e) => {
      this.deleteFile(filename);
      throw new BadRequestException(e);
    });
  }

  remove(filename: string) {
    if (!filename.startsWith(this.rootPath)) {
      filename = path.join(this.rootPath, filename);
    }
    this.deleteFile(filename);
    return this.deleteRecord(filename).then((res) => {
      return (
        res || {
          id: 0,
          filename,
        }
      );
    });
  }

  /**
   * File Record on Table
   */
  getRecord(filename: string) {
    return this.repository.findOneBy({ filename });
  }

  async saveRecord(file: Express.Multer.File, body: CreateFileDto) {
    const fileIns = new FileEntity();
    fileIns.type = file.mimetype;
    fileIns.size = file.size;
    fileIns.name = body.name || file.originalname;
    fileIns.path = path.join(this.rootPath, body.path);
    fileIns.filename = path.join(fileIns.path, fileIns.name);
    fileIns.url = `${this.serverUrl}/${fileIns.filename}`;
    fileIns.metadata = body.metadata;
    const record = await this.getRecord(fileIns.filename);
    if (record) {
      fileIns.id = record.id;
    }
    return fileIns.save();
  }

  async deleteRecord(filename: string) {
    const record = await this.getRecord(filename);
    if (record) {
      return record.remove();
    }
  }

  /**
   * File Storage
   */

  saveFile(file: Express.Multer.File, body: CreateFileDto) {
    const name = body.name || file.originalname;
    const fullpath = path.join(this.rootPath, body.path);
    try {
      if (!fs.existsSync(fullpath)) {
        fs.mkdirSync(fullpath, { recursive: true });
      }
      fs.writeFileSync(path.join(fullpath, name), Buffer.from(file.buffer));
      return path.join(fullpath, name);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  deleteFile(filename: string) {
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
  }
}
