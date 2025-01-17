import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@backend/typeorm/task.entity';
import { User } from '@backend/typeorm/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectsService } from '../projects/projects.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Project } from '@backend/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private repo: Repository<Task>,
    private projectService: ProjectsService,
  ) {}

  getRepository() {
    return this.repo;
  }

  findAll() {
    return this.repo.find();
    return this.repo.find({ relations: { assignee: true, project: true } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  findByCode(code: string) {
    return this.repo.findOneBy({ code });
  }

  async update(id: number, data: UpdateTaskDto) {
    const task = await this.repo.findOneBy({ id });
    if (data.assigneeId) {
      task.assignee = User.create({ id: data.assigneeId });
    }
    return task.save();
  }

  async create(body: CreateTaskDto) {
    const task = Task.create(body);
    const project = await this.projectService.findOne(body.projectId);
    const code = project.key + '-' + (project.metadata.last + 1);
    task.code = code;
    task.project = Project.create({ id: body.projectId });
    if (body.assigneeId) {
      task.assignee = User.create({ id: body.assigneeId });
    }
    return task
      .save()
      .then(() => {
        project.metadata.last = project.metadata.last + 1;
        return project.save();
      })
      .then(() => task);
  }
}
