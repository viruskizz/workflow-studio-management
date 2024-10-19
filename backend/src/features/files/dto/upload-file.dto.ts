import { ApiProperty, PartialType } from '@nestjs/swagger';
import { FileEntity } from '../../../typeorm/file.entity';
import { IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateFileDto extends PartialType(FileEntity) {
  @IsString()
  @ApiProperty({
    description: 'path to file. / for root but not recommend',
    example: '/',
    required: true,
  })
  path: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'filename replacement',
    example: 'example.jpg',
    required: false,
  })
  name?: string;

  @IsJSON()
  @IsOptional()
  @ApiProperty({
    description: 'additional file infomation as JSON format',
    example: '{"owner":"araiva"}',
    required: false,
  })
  metadata?: string;
}
