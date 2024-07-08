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
import { TeamsStageService } from './team-stage.service';
import { CreateTeamStageDto } from './dto/create-team-stage.dto';
import { TeamValidateInterceptor } from '../team-validate.interceptor';
import { UpdateTeamStageDto } from './dto/update-team-stage.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Teams')
@UseInterceptors(TeamValidateInterceptor)
@Controller('teams/:id/stages')
export class TeamsStageController {
  constructor(private stageService: TeamsStageService) {}

  @Get()
  @ApiOperation({ summary: 'List all stages of selected team' })
  findAll(@Param('id') id) {
    return this.stageService.findAll(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a stage of selected team' })
  create(@Param('id') id, @Body() body: CreateTeamStageDto) {
    return this.stageService.create(+id, body);
  }

  @Put()
  @ApiOperation({ summary: 'Update all stages of selected team' })
  update(
    @Param('id') id,
    @Body(new ParseArrayPipe({ items: UpdateTeamStageDto, whitelist: true }))
    body: UpdateTeamStageDto[],
  ) {
    return this.stageService.update(+id, body);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Reodering stages of selected team' })
  reorder(@Param('id') id) {
    return this.stageService.reorder(+id);
  }

  @Patch(':stageId')
  @ApiOperation({ summary: 'Update only selected stage' })
  edit(
    @Param('id') id,
    @Param('stageId') stageId,
    @Body() body: UpdateTeamStageDto,
  ) {
    return this.stageService.edit(+stageId, body);
  }

  @Delete(':stageId')
  @ApiOperation({ summary: 'Remove only selected stage' })
  remove(@Param('teamId') teamId, @Param('stageId') stageId) {
    return this.stageService.remove(+stageId);
  }
}
