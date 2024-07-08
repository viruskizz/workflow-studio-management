import { IsEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateTeamStageDto } from './create-team-stage.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeamStageDto extends CreateTeamStageDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  id?: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  order: number;
}
