import { Project, Task } from '@backend/typeorm/';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectsModule } from '../projects/projects.module';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), ProjectsModule, UsersModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
