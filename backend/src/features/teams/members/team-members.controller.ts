import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { TeamValidateInterceptor } from '../team-validate.interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Teams')
@UseInterceptors(TeamValidateInterceptor)
@Controller('teams/:id/members/')
export class TeamsMembersController {
  constructor(private membersService: TeamMembersService) {}

  @Get()
  @ApiOperation({ summary: 'List all member of team' })
  list(@Param('id') id) {
    return this.membersService.listMembers(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Add new member to team' })
  add(@Param('id') id, @Body() body: AddTeamMemberDto) {
    return this.membersService.addMember(+id, body.userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove member to team' })
  remove(@Param('id') id, @Body() body: AddTeamMemberDto) {
    return this.membersService.removeMember(+id, body.userId);
  }
}
