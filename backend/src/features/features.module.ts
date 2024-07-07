import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { FilesModule } from './files/files.module';
import { TasksModule } from './tasks/tasks.module';
<<<<<<< HEAD
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProjectsModule,
    FilesModule,
    TasksModule,
    TeamsModule,
  ],
=======

@Module({
  imports: [UsersModule, AuthModule, ProjectsModule, FilesModule, TasksModule],
>>>>>>> c24f244 (display users from database)
  exports: [UsersModule, AuthModule, ProjectsModule, FilesModule, TasksModule],
})
export class FeaturesModule {}
