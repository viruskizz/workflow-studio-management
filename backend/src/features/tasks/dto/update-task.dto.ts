import { TaskStatus, TaskType } from '@backend/typeorm/task.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends CreateTaskDto {
  @ApiProperty({ description: 'forbidden to update project id' })
  @IsEmpty()
  projectId: number;

  @ApiProperty({ description: 'forbidden to update code' })
  @IsEmpty()
  code: string;

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
  assigneeId: number;
}
