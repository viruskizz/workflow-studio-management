import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectTasksService } from './project-tasks.service';
import { ProjectValidateInterceptor } from '../project-validate.interceptor';
import { CreateProjectTaskDto } from './dto/create-project-task.dto';
import {
  QueryOption,
  QueryOptionInterface,
} from '@backend/shared/decorators/query-option.decorator';
import { QueryTreeOptionInterface } from '@backend/features/tasks/dto/query-tree-option.interface';

@ApiBearerAuth()
@ApiTags('Projects')
@UseInterceptors(ProjectValidateInterceptor)
@Controller('projects/:id/tasks')
export class ProjectTasksController {
  constructor(private service: ProjectTasksService) {}

  @Get('tree')
  @ApiOperation({ summary: 'List all tasks' })
  async findByTree(@Param('id') id, @Query() query?: QueryTreeOptionInterface) {
    return this.service.tree(+id, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create new project task' })
  async create(@Param('id') id, @Body() body: CreateProjectTaskDto) {
    body.projectId = +id;
    return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  async findAll(@Param('id') id, @QueryOption() query?: QueryOptionInterface) {
    query.filter = {
      ...query.filter,
      projectId: id,
    };
    return this.service.list(query);
  }
}
