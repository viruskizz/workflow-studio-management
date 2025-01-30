import { CreateTaskDto } from '@backend/features/tasks/dto/create-task.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';

export class CreateProjectTaskDto extends CreateTaskDto {
  @IsEmpty()
  @ApiProperty({ example: 1 })
  projectId: number;
}
