import { PartialType } from '@nestjs/mapped-types';
import { Team } from '../../../typeorm/team.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTeamDto extends PartialType(Team) {
  @IsString()
  @ApiProperty({ example: 'GoodGeek' })
  name: string;

  @IsNumber()
  @ApiProperty({ example: 1 })
  leaderId: number;
}
