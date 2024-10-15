import { TaskStatus } from '../../../../typeorm/task.entity';
import { TeamStage } from '../../../../typeorm/team-stage.entity';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateTeamStageDto extends PartialType(TeamStage) {
  @IsString()
  @ApiProperty({ example: 'Waiting' })
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  teamId: number;

  @ApiProperty({ example: 'TODO' })
  @IsEnum(TaskStatus)
  taskStatus: TaskStatus;
}
