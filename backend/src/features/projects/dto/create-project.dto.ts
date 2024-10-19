import { Project } from '../../../typeorm';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUppercase,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateProjectDto extends PartialType(Project) {
  @IsString()
  @Length(4)
  @IsUppercase()
  @IsNotEmpty()
  @ApiProperty({ example: 'DEMO' })
  key: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Demo Project' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'This is demo project for testing purpose',
  })
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  ownerId: number;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    required: false,
    example:
      'https://initiate.alphacoders.com/images/109/stretched-1920-1080-109174.jpg',
  })
  imageUrl?: string;
}
