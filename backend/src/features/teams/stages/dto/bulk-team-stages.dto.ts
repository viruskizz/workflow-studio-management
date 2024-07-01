import { TeamStage } from '@backend/typeorm';
import { TaskStatus } from '@backend/typeorm/task.entity';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsString,
  ValidateNested,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';
import { UpdateTeamStageDto } from './update-team-stage.dto';

export class BulkTeamStagesDto {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateTeamStageDto)
  items: UpdateTeamStageDto[];
}
