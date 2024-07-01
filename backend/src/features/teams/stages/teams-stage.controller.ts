import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { TeamsStageService } from './teams-stage.service';
import { CreateTeamStageDto } from './dto/create-team-stage.dto';
import { TeamValidateInterceptor } from '../team-validate.interceptor';
import { BulkTeamStagesDto } from './dto/bulk-team-stages.dto';
import { UpdateTeamStageDto } from './dto/update-team-stage.dto';

@UseInterceptors(TeamValidateInterceptor)
@Controller('teams/:id/stages')
export class TeamsStageController {
  constructor(private stageService: TeamsStageService) {}

  @Get()
  findAll(@Param('id') id) {
    return this.stageService.findAll(+id);
  }

  @Post()
  create(@Param('id') id, @Body() body: CreateTeamStageDto) {
    return this.stageService.create(+id, body);
  }

  @Put()
  update(
    @Param('id') id,
    @Body(new ParseArrayPipe({ items: UpdateTeamStageDto, whitelist: true }))
    body: UpdateTeamStageDto[],
  ) {
    console.log(body);
    return this.stageService.update(+id, body);
  }

  @Patch('reorder')
  reorder(@Param('id') id) {
    return this.stageService.reorder(+id);
  }

  @Patch(':stageId')
  edit(
    @Param('id') id,
    @Param('stageId') stageId,
    @Body() body: UpdateTeamStageDto,
  ) {
    return this.stageService.edit(+stageId, body);
  }

  @Delete(':stageId')
  remove(@Param('teamId') teamId, @Param('stageId') stageId) {
    return this.stageService.remove(+stageId);
  }
}
