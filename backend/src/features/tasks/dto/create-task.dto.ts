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
  @IsNumber()
  @ApiProperty({ example: 1 })
  projectId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'summary of this task' })
  summary: string;

  @IsEnum(TaskType)
  @ApiProperty({ enum: TaskType, example: 'TASK' })
  type: TaskType;

  @IsEnum(TaskStatus)
  @ApiProperty({ enum: TaskStatus, example: 'TODO' })
  status: TaskStatus;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2 })
  assigneeId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1 })
  parentId: number;
}
