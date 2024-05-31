import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiBearerAuth()
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private service: ProjectsService,
    private usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() body: CreateProjectDto) {
    const user = this.usersService.findOne(body.ownerId);
    if (!user) {
    }
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    const project = await this.service.findOne(+id);
    if (!project) {
      throw new NotFoundException();
    }
    return project;
  }

  @Post(':id')
  update(@Param('id') id, @Body() body: UpdateProjectDto) {
    this.findOne(id);
    return this.service.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id) {
    this.findOne(id);
    return this.service.remove(+id);
  }
}
