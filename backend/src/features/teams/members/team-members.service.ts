import { TeamMember } from '@backend/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectRepository(TeamMember)
    private repo: Repository<TeamMember>,
  ) {}

  listMembers(teamId: number) {
    return this.repo.find({
      where: {
        teamId,
      },
      relations: {
        user: true,
      },
    });
  }

  getMemberByUserId(teamId: number, userId: number) {
    return this.repo.findOneBy({ teamId, userId });
  }

  async addMember(teamId: number, userId: number) {
    const relation = await this.getMemberByUserId(teamId, userId);
    if (relation) {
      throw new BadRequestException('Member already in team');
    }
    const member = new TeamMember();
    member.teamId = teamId;
    member.userId = userId;
    return member.save();
  }

  async removeMember(teamId: number, userId: number) {
    const relation = await this.getMemberByUserId(teamId, userId);
    if (!relation) {
      throw new BadRequestException(`Member has't in team yet.`);
    }
    return relation.remove();
  }
}
