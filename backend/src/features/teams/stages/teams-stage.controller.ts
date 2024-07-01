import { Body, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { TeamsStageService } from './teams-stage.service';
import { CreateTeamStageDto } from './dto/create-team-stage.dto';
import { TeamValidateInterceptor } from '../team-validate.interceptor';

@UseInterceptors(TeamValidateInterceptor)
@Controller('teams/:id/stages')
export class TeamsStageController {
  constructor(private stageService: TeamsStageService) {}

  @Get()
  findAll(@Param('id') id) {
    return this.stageService.findAll(+id);
  }

  create(@Param('id') identity, @Body() body: CreateTeamStageDto) {

  }
}
