import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/upload-file.dto';
import { RemoveFileDto } from './dto/remove-file.dto';
import * as path from 'path';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get('search')
  list() {
    return [];
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  upload(
    @Body() body: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!body || !body.path) {
      throw new BadRequestException('Path is required');
    }
    return this.filesService.save(file, body);
  }

  @Delete()
  remove(@Body() body: RemoveFileDto) {
    if (body && !body.filename && !body.url) {
      throw new BadRequestException('Need filename or url');
    }
    let filename: string;
    if (body.filename) {
      filename = body.filename;
    } else {
      filename = body.url.replace(this.filesService.serverUrl, '');
    }
    return this.filesService.remove(filename);
  }

  @Get()
  get(@Query('filename') filename: string) {
    if (!filename.startsWith(this.filesService.rootPath)) {
      filename = path.join(this.filesService.rootPath, filename);
    }
    console.log(filename);
    return this.filesService.getRecord(filename);
  }
}
