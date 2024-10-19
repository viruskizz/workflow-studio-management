import { FileEntity } from '../../../typeorm';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RemoveFileDto extends PartialType(FileEntity) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'full file name with path',
    example: '/public/demo/example.jpg',
  })
  filename?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'full image url',
    example: 'http://localhost:3000/public/demo/example.jpg',
  })
  url?: string;
}
