import { TeamMember } from '@backend/typeorm';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddTeamMemberDto extends PartialType(TeamMember) {
  @ApiProperty()
  @IsNumber()
  userId: number;
}
