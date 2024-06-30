import { PartialType } from '@nestjs/mapped-types';
import { Team } from '@backend/typeorm/team.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTeamDto extends PartialType(Team) {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  leaderId: number;
}
