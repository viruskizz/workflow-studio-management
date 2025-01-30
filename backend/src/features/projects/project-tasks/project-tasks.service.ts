import { CreateTaskDto } from '@backend/features/tasks/dto/create-task.dto';
import { QueryTreeOptionInterface } from '@backend/features/tasks/dto/query-tree-option.interface';
import { TasksService } from '@backend/features/tasks/tasks.service';
import { QueryOptionInterface } from '@backend/shared/decorators/query-option.decorator';
import { Task } from '@backend/typeorm';
import { TaskType } from '@backend/typeorm/task.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectTasksService {
  constructor(private tasksService: TasksService) {}

  list(options: QueryOptionInterface) {
    return this.tasksService.findAll(options);
  }

  create(body: CreateTaskDto) {
    return this.tasksService.create(body);
  }

  async tree(projectId: number, options: QueryTreeOptionInterface) {
    if (!options.parentId) {
      return this.tasksService.getRepository().find({
        where: {
          projectId,
          type: TaskType.EPIC,
        },
        relations: ['assignee'],
      });
    }
    const parentTask = await this.tasksService.getRepository().findOneBy({
      id: options.parentId,
      projectId,
    });
    return this.tasksService
      .getTreeRepository()
      .findDescendantsTree(parentTask, {
        depth: options.depth,
        relations: ['assignee'],
      });
  }
}
