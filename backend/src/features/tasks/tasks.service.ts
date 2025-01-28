import { BadRequestException, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskType } from '@backend/typeorm/task.entity';
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
    const project = await this.getValidProject(body.projectId);
    const parent = await this.getValidParentTask(body);
    task.code = project.key + '-' + (project.metadata.last + 1);
    task.project = project;
    task.parent = parent;
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

  private async getValidProject(projectId: number) {
    const project = await this.projectService.findOne(projectId);
    if (!project) {
      throw new BadRequestException('Project does not existed');
    }
    return project;
  }
  private async getValidParentTask(body: CreateTaskDto) {
    if (!body.parentId) {
      return undefined;
    }
    const taskTypes = Object.keys(TaskType);
    const parent = await this.repo.findOneBy({ id: body.parentId });
    if (!parent) {
      throw new BadRequestException('Task does not existed');
    }
    const parentTypeIdx = taskTypes.findIndex((t) => t === parent.type);
    const childTypeIdx = taskTypes.findIndex((t) => t === body.type);
    if (childTypeIdx - parentTypeIdx !== 1) {
      throw new BadRequestException('Child type is not sequence');
    }
    return parent;
  }
}
