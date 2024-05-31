import { Project } from '@backend/typeorm';
import { PartialType } from '@nestjs/mapped-types';
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
  key: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  ownerId: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
