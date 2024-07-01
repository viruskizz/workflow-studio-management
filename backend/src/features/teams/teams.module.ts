import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from '@backend/typeorm/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { TeamsStageController } from './stages/team-stage.controller';
import { TeamsStageService } from './stages/team-stage.service';
import { TeamMember, TeamStage } from '@backend/typeorm';
import { TeamMembersService } from './members/team-members.service';
import { TeamsMembersController } from './members/team-members.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamStage, TeamMember]),
    UsersModule,
  ],
  controllers: [TeamsController, TeamsStageController, TeamsMembersController],
  providers: [TeamsService, TeamsStageService, TeamMembersService],
  exports: [TeamsService, TeamsStageService, TeamMembersService],
})
export class TeamsModule {}
