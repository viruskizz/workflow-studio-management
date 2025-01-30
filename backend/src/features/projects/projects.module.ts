import { ProjectTasksService } from './project-tasks/project-tasks.service';
import { Project } from '@backend/typeorm/';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ProjectTasksController } from './project-tasks/project-tasks.controller';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UsersModule,
    forwardRef(() => TasksModule),
  ],
  controllers: [ProjectsController, ProjectTasksController],
  providers: [ProjectsService, ProjectTasksService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
