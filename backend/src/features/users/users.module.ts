import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDashboardController } from './dashboard/user-dashboard.controller';
import { UserDashboardService } from './dashboard/user-dashboard.service';
import { UsersService } from './users.service';
import { TasksModule } from '../tasks/tasks.module';
import { TeamsModule } from '../teams/teams.module';
import { ProjectsModule } from '../projects/projects.module';

import { UsersController } from './users.controller';
import { User, UserDashboard } from '@backend/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDashboard]),
    forwardRef(() => TasksModule),
    forwardRef(() => TeamsModule),
    forwardRef(() => ProjectsModule),
  ],
  controllers: [UsersController, UserDashboardController],
  providers: [UsersService, UserDashboardService],
  exports: [UsersService],
})
export class UsersModule {}
