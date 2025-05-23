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
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectsService } from '../projects/projects.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  QueryOption,
  QueryOptionInterface,
} from '@backend/shared/decorators/query-option.decorator';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
    @Inject(forwardRef(() => ProjectsService))
    private projectsSerivce: ProjectsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  async list(@QueryOption() query?: QueryOptionInterface) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task information' })
  get(@Param('id') id) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task information' })
  async update(@Param('id') id, @Body() body: UpdateTaskDto) {
    await this.validateProjectId(body);
    const task = await this.tasksService.findOne(+id);
    if (!task) {
      throw new NotFoundException('Task does not existed');
    }
    return this.tasksService.update(+id, body);
  }

  @Post()
  @ApiOperation({ summary: 'Create new task' })
  async create(@Body() body: CreateTaskDto) {
    await this.validateProjectId(body);
    return this.tasksService.create(body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.delete(id);
  }

  private async validateProjectId(body: any) {
    const project = await this.projectsSerivce.findOne(body.projectId);
    if (!project) {
      throw new BadRequestException('Project Not Found');
    }
  }
}
