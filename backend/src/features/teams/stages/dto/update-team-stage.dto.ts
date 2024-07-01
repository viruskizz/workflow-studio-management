import { PartialType } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';
import { CreateTeamStageDto } from './create-team-stage.dto';

export class UpdateTeamDto extends PartialType(CreateTeamStageDto) {
  @IsEmpty()
  id?: number;
}
