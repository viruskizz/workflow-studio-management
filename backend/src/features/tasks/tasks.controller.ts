import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectsService } from '../projects/projects.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private tasksservice: TasksService,
    @Inject(forwardRef(() => ProjectsService))
    private projectsSerivce: ProjectsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  list() {
    return this.tasksservice.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task information' })
  get(@Param('id') id) {
    return this.tasksservice.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task information' })
  async update(@Param('id') id, @Body() body: UpdateTaskDto) {
    await this.validateProjectId(body);
    const task = await this.tasksservice.findOne(+id);
    if (!task) {
      throw new NotFoundException('Task does not existed');
    }
    return this.tasksservice.update(+id, body);
  }

  @Post()
  @ApiOperation({ summary: 'Create new task' })
  async create(@Body() body: CreateTaskDto) {
    await this.validateProjectId(body);
    return this.tasksservice.create(body);
  }

  private async validateProjectId(body: any) {
    const project = await this.projectsSerivce.findOne(body.projectId);
    if (!project) {
      throw new BadRequestException('Project Not Found');
    }
  }
}
