import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from '@backend/typeorm/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { TeamsStageController } from './stages/teams-stage.controller';
import { TeamsStageService } from './stages/teams-stage.service';
import { TeamStage } from '@backend/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamStage]), UsersModule],
  controllers: [TeamsController, TeamsStageController],
  providers: [TeamsService, TeamsStageService],
  exports: [TeamsService, TeamsStageService],
})
export class TeamsModule {}
