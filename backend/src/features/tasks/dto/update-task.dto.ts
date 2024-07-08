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
  @ApiProperty({
    required: false,
    description: 'forbidden to update project id',
  })
  @IsEmpty()
  projectId: number;

  @ApiProperty({ required: false, description: 'forbidden to update code' })
  @IsEmpty()
  code: string;
}
