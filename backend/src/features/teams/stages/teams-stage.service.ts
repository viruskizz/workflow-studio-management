import { TeamStage } from '@backend/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamStageDto } from './dto/create-team-stage.dto';
import { UpdateTeamStageDto } from './dto/update-team-stage.dto';

@Injectable()
export class TeamsStageService {
  constructor(
    @InjectRepository(TeamStage)
    private repo: Repository<TeamStage>,
  ) {}

  findAll(teamId: number) {
    return this.repo.find({
      where: { teamId },
      order: {
        order: 'ASC',
      },
    });
  }

  async create(teamId: number, body: CreateTeamStageDto) {
    const stages = await this.findAll(teamId);
    const stage = new TeamStage();
    stage.name = body.name;
    stage.order = stages.length + 1;
    stage.teamId = teamId;
    stage.taskStatus = body.taskStatus;
    return stage.save();
  }

  async edit(stageId: number, body: UpdateTeamStageDto) {
    const stage = await this.repo.findOneBy({ id: stageId });
    stage.name = body.name;
    stage.order = body.order;
    stage.taskStatus = body.taskStatus;
    return stage.save();
  }

  async update(teamId: number, body: UpdateTeamStageDto[]) {
    const result = [];
    for (const b of body) {
      const res = await this.edit(b.id, b);
      result.push(res);
    }
    return result;
  }

  async remove(stageId: number) {
    const stage = await this.repo.findOneBy({ id: stageId });
    if (!stage) {
      throw new NotFoundException('Stage does not existed');
    }
    return stage.remove().then();
  }

  async reorder(teamId: number) {
    const stages = await this.findAll(teamId);
    for (let i = 0; i < stages.length; i++) {
      stages[i].order = i;
      stages[i].save();
    }
    return stages;
  }
}
