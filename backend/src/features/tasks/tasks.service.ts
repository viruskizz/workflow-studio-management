import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskType } from '@backend/typeorm/task.entity';
import { User } from '@backend/typeorm/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectsService } from '../projects/projects.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Project } from '@backend/typeorm';
import { QueryOptionInterface } from '@backend/shared/decorators/query-option.decorator';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private repo: Repository<Task>,
    private projectService: ProjectsService,
  ) {}

  getTreeRepository() {
    return this.repo.manager.getTreeRepository(Task);
  }
  getRepository() {
    return this.repo;
  }

  findAll(options?: QueryOptionInterface) {
    const opt = {
      where: options.filter,
      select: options.select,
      skip: options.offset,
      take: options.limit,
    };
    return this.repo.find(opt).catch((e) => {
      throw new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  findByCode(code: string) {
    return this.repo.findOneBy({ code });
  }

  async update(id: number, data: UpdateTaskDto) {
    const task = await this.repo.findOneBy({ id });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.summary = data.summary || task.summary;
    task.description = data.description || task.description;
    task.status = data.status || task.status;
    task.type = data.type || task.type;
    const parent = await this.getValidParentTask(data);
    task.parent = parent;
    if (data.assigneeId) {
      task.assignee = User.create({ id: data.assigneeId });
    }
    return this.repo.save(task);
  }

  async create(body: CreateTaskDto) {
    const task = Task.create(body);
    const project = await this.getValidProject(body.projectId);
    const parent = await this.getValidParentTask(body);
    task.project = project;
    task.parent = parent;
    task.code = project.key + '-' + (project.metadata.last + 1);
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
    console.log(parent.type, body.type);
    if (childTypeIdx - parentTypeIdx !== 1) {
      throw new BadRequestException('Child type is not sequence');
    }
    return parent;
  }

  async findTasksByUserId(userId: number) {
    return this.repo.find({
      where: { assignee: { id: userId } },
      relations: ['assignee', 'project'],
    });
  }

  async delete(id: number) {
    const task = await this.repo.findOneBy({ id });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if task has children
    const children = await this.repo.find({ where: { parentId: id } });
    if (children.length > 0) {
      throw new BadRequestException('Cannot delete task with child tasks');
    }

    await this.repo.remove(task);
    return { success: true };
  }
}
