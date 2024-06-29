import { Task } from '@backend/typeorm';
import { TaskStatus, TaskType } from '@backend/typeorm/task.entity';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto extends PartialType(Task) {
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty()
  @IsEnum(TaskType)
  type: TaskType;

  @ApiProperty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  assigneeId: number;
}
