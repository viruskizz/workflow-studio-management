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

@UseInterceptors(TeamValidateInterceptor)
@Controller('teams/:id/members/')
export class TeamsMembersController {
  constructor(private membersService: TeamMembersService) {}

  @Get()
  list(@Param('id') id) {
    return this.membersService.listMembers(+id);
  }

  @Post()
  add(@Param('id') id, @Body() body: AddTeamMemberDto) {
    return this.membersService.addMember(+id, body.userId);
  }

  @Delete()
  remove(@Param('id') id, @Body() body: AddTeamMemberDto) {
    return this.membersService.removeMember(+id, body.userId);
  }
}
