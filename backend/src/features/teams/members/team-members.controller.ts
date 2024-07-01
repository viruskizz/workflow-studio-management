import { Controller, Get, Param } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';

@Controller('teams/:id/members/')
export class TeamsMembersController {
  constructor(private membersService: TeamMembersService) {}

  @Get()
  list(@Param('id') id) {
    return this.membersService.listMembers(+id);
  }
}

// @Controller('team-members/')
// export class TeamsMembersController {
//   constructor() {}
// }
