import { TeamMember } from '@backend/typeorm';
import { Injectable } from '@nestjs/common';
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
}
