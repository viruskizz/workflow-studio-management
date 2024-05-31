import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsEmpty } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsEmpty()
  key?: string;
}
