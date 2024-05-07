import {
  Body,
  Controller,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @UseInterceptors(FileInterceptor('file'))
  upload(@Body() body, @UploadedFile() file: Express.Multer.File) {
    console.log(body);
    return body;
  }

  @Get()
  list() {
    return;
  }
}
