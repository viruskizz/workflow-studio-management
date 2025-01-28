import { CreateTaskDto } from '@backend/features/tasks/dto/create-task.dto';
import { TasksService } from '@backend/features/tasks/tasks.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectTasksService {
  constructor(private tasksService: TasksService) {}

  list(projectId: number) {
    return this.tasksService.getRepository().findBy({ projectId });
  }

  create(body: CreateTaskDto) {
    return this.tasksService.create(body);
  }

  tree() {
    return this.tasksService.getTreeRepository().findTrees({
      // relations: ['project'],
    });
  }
}
