import { TeamMember } from '../../../../typeorm';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddTeamMemberDto extends PartialType(TeamMember) {
  @IsNumber()
  @ApiProperty({ example: 2 })
  userId: number;
}
