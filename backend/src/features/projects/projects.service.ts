import { Project } from '@backend/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, getRepository } from 'typeorm';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UsersService } from '../users/users.service';
import { appDataSource } from '@backend/utils/dbconfig';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private repository: Repository<Project>,
    private usersService: UsersService,
  ) {}

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  async create(data: CreateProjectDto) {
    const user = await this.usersService.findOne(data.ownerId);
    if (!user) {
      throw new BadRequestException('Not found user');
    }
    const project = Project.create(data);
    project.owner = user;
    return project.save();
  }

  update(id: number, data: UpdateProjectDto) {
    return this.repository.update(id, data);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
