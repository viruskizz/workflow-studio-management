import { TasksService } from '@backend/features/tasks/tasks.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectTasksService {
  constructor(private tasksService: TasksService) {}

  list(projectId: number) {
    return this.tasksService.getRepository().findBy({ projectId });
  }
}
