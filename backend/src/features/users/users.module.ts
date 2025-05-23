import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDashboardController } from './dashboard/user-dashboard.controller';
import { UserDashboardService } from './dashboard/user-dashboard.service';
import { UsersService } from './users.service';
import { TasksModule } from '../tasks/tasks.module';
import { TeamsModule } from '../teams/teams.module';
import { ProjectsModule } from '../projects/projects.module';

import { UsersController } from './users.controller';
import { Auth, User } from '@backend/typeorm';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TasksModule),
    forwardRef(() => TeamsModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController, UserDashboardController],
  providers: [UsersService, UserDashboardService],
  exports: [UsersService],
})
export class UsersModule {}
