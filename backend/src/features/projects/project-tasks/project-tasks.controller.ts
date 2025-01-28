import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectTasksService } from './project-tasks.service';
import { ProjectValidateInterceptor } from '../project-validate.interceptor';
import { CreateProjectTaskDto } from './dto/create-project-task.dto';

@ApiBearerAuth()
@ApiTags('Projects')
@UseInterceptors(ProjectValidateInterceptor)
@Controller('projects/:id/tasks')
export class ProjectTasksController {
  constructor(private service: ProjectTasksService) {}

  @Get('tree')
  @ApiOperation({ summary: 'List all tasks' })
  async findByTree() {
    return this.service.tree();
  }

  @Post()
  @ApiOperation({ summary: 'Create new project task' })
  async create(@Param('id') id, @Body() body: CreateProjectTaskDto) {
    body.projectId = +id;
    return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  async findAll(@Param('id') id) {
    return this.service.list(id);
  }
}
