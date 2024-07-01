import { TeamStage } from '@backend/typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamStageDto } from './dto/create-team-stage.dto';

@Injectable()
export class TeamsStageService {
  constructor(
    @InjectRepository(TeamStage)
    private repo: Repository<TeamStage>,
  ) {}

  findAll(teamId: number) {
    return this.repo.findBy({ teamId });
  }

  create(teamId: number, body: CreateTeamStageDto) {
    
  }
}
