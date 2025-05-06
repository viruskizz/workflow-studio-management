import { Project } from '@backend/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private repository: Repository<Project>,
    private usersService: UsersService,
  ) {}

  repo() {
    return this.repository;
  }

  findAll() {
    return this.repository.find({
      relations: {
        leader: true,
      },
    });
  }

  findOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: {
        leader: true,
      },
    });
  }

  async create(data: CreateProjectDto) {
    const project = this.repository.create(data);
    if (data.leaderId) {
      const user = await this.usersService.findOne(data.leaderId);
      if (!user) {
        throw new BadRequestException('Not found user');
      }
      project.leaderId = data.leaderId;
    }
    return project.save().then((p: Project) => this.findOne(p.id));
  }

  update(id: number, data: UpdateProjectDto) {
    return this.repository.update(id, data);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }

  async findProjectsWorkingOnByUserId(userId: number) {
    // Find projects where the user is the leader
    const projects = await this.repository.find({
      where: { leaderId: userId },
      relations: {
        leader: true,
      },
    });

    return projects;
  }

  async findUsersByProjectIds(projectIds: number[]) {
    if (!projectIds.length) return [];

    console.log(`Finding users for project IDs: ${projectIds.join(', ')}`);

    // Find all users who are working on these projects
    // This assumes you have a relationship between projects and users
    const users = await this.usersService
      .getRepository()
      .createQueryBuilder('user')
      .innerJoin('user.projects', 'project', 'project.id IN (:...projectIds)', {
        projectIds,
      })
      .getMany();

    console.log(`Found ${users.length} users for these projects`);
    return users;
  }
}
