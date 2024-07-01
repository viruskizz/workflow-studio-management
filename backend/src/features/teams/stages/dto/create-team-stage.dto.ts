import { TaskStatus } from '@backend/typeorm/task.entity';
import { TeamStage } from '@backend/typeorm/team-stage.entity';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateTeamStageDto extends PartialType(TeamStage) {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  teamId: number;

  @ApiProperty()
  @IsEnum(TaskStatus)
  taskStatus: TaskStatus;
}
