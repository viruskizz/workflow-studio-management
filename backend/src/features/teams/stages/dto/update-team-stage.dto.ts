import { IsEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateTeamStageDto } from './create-team-stage.dto';

export class UpdateTeamStageDto extends CreateTeamStageDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsEmpty()
  teamId: number;

  @IsNumber()
  order: number;
}
