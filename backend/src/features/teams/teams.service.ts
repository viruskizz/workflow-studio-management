import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team, User, TeamMember } from '@backend/typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private repo: Repository<Team>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    return this.repo.findOne({
      where: { id },
      relations: { leader: true, stages: true },
    });
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
    try {
      // First check if team exists
      const team = await this.findOne(id);
      if (!team) {
        throw new NotFoundException(`Team with ID ${id} not found`);
      }
      
      // Check if team has stages and delete them first
      if (team.stages && team.stages.length > 0) {
        // Delete all stages associated with the team
        await this.repo.manager.createQueryBuilder()
          .delete()
          .from('team_stage')
          .where('teamId = :teamId', { teamId: id })
          .execute();
      }
      
      // Check if team has members and delete the relationships first
      const teamMembers = await this.repo.manager.find(TeamMember, {
        where: { teamId: id }
      });
      
      if (teamMembers.length > 0) {
        await this.repo.manager.createQueryBuilder()
          .delete()
          .from('team_member')
          .where('teamId = :teamId', { teamId: id })
          .execute();
      }
      
      // Now it's safe to delete the team
      return await this.repo.remove(team);
    } catch (error) {
      console.error(`Error deleting team with ID ${id}:`, error);
      throw error;
    }
  }
}
