import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team, User } from '@backend/typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private repo: Repository<Team>,
    private userSerivce: UsersService,
  ) {}
  async create(createTeamDto: CreateTeamDto) {
    const user = await this.userSerivce.findOne(createTeamDto.leaderId);
    if (!user) {
      throw new BadRequestException('Leader user does not existed');
    }
    const team = Team.create({
      name: createTeamDto.name,
      leaderId: createTeamDto.leaderId,
      leader: user,
    });
    return team.save();
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.findOne(id);
    if (updateTeamDto.leaderId) {
      const user = await this.userSerivce.findOne(updateTeamDto.leaderId);
      if (!user) {
        throw new BadRequestException('Leader user does not existed');
      }
      team.leader = user;
      team.leaderId = updateTeamDto.leaderId;
    }
    team.name = updateTeamDto.name || team.name;
    return team.save();
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    return team.remove();
  }
}
