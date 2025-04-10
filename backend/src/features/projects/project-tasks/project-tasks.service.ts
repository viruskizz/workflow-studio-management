import { CreateTaskDto } from '@backend/features/tasks/dto/create-task.dto';
import { QueryTreeOptionInterface } from '@backend/features/tasks/dto/query-tree-option.interface';
import { TasksService } from '@backend/features/tasks/tasks.service';
import { QueryOptionInterface } from '@backend/shared/decorators/query-option.decorator';
import { Task } from '@backend/typeorm';
import { TaskType } from '@backend/typeorm/task.entity';
import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';

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
    const treeRepo = this.tasksService.getTreeRepository();
    const repo = this.tasksService.getRepository();
    const root = repo.find({
      where: {
        projectId,
        parentId: IsNull(),
      },
      relations: ['assignee'],
    });
    if (options.all) {
      return root.then((parents) =>
        Promise.all(
          parents.map((parent) =>
            treeRepo.findDescendantsTree(parent, { relations: ['assignee'] }),
          ),
        ),
      );
    }
    if (!options.parentId) {
      return root;
    } else {
      return repo
        .findOneBy({
          id: options.parentId,
          projectId,
        })
        .then((parentTask) =>
          treeRepo.findDescendantsTree(parentTask, {
            depth: options.depth,
            relations: ['assignee'],
          }),
        );
    }
  }
}
