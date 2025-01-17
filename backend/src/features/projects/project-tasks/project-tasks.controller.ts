import { UsersService } from '@backend/features/users/users.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectTasksService } from './project-tasks.service';

@ApiBearerAuth()
@ApiTags('Projects')
@Controller('projects/:id/tasks')
export class ProjectTasksController {
  constructor(private service: ProjectTasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create new project task' })
  async create(@Param('id') id, @Body() body: CreateProjectDto) {
    // return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  findAll(@Param('id') id) {
    return this.service.list(id);
  }
}
