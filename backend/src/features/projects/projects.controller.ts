import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectValidateInterceptor } from './project-validate.interceptor';

@ApiBearerAuth()
@UseInterceptors(ProjectValidateInterceptor)
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private service: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new project' })
  async create(@Body() body: CreateProjectDto) {
    return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve project information' })
  async findOne(@Param('id') id) {
    const project = await this.service.findOne(+id);
    if (!project) {
      throw new NotFoundException();
    }
    return project;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project information' })
  update(@Param('id') id, @Body() body: UpdateProjectDto) {
    this.findOne(id);
    return this.service.update(+id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  remove(@Param('id') id) {
    this.findOne(id);
    return this.service.remove(+id);
  }
}
