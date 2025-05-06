import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@backend/typeorm';
import { TasksService } from '@backend/features/tasks/tasks.service';
import { ProjectsService } from '@backend/features/projects/projects.service';
import { TeamsService } from '@backend/features/teams/teams.service';
import { TeamMembersService } from '@backend/features/teams/members/team-members.service';

@Injectable()
export class UserDashboardService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private taskService: TasksService,
    private projectService: ProjectsService,
    private teamsService: TeamsService,
    private teamMembersService: TeamMembersService,
  ) {}

  getRepository() {
    return this.usersRepository;
  }

  // GET /users/:id/dashboard
  async getDashboardSummary(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get all dashboard data
    const [taskStats, workingOn, workingWith] = await Promise.all([
      this.getTaskStats(userId),
      this.getWorkingOn(userId),
      this.getWorkingWith(userId),
    ]);

    return {
      user,
      taskStats,
      workingOn,
      workingWith,
    };
  }

  // GET /users/:id/dashboard/stats
  // SQL: SELECT status, COUNT(*) as count FROM tasks WHERE assignee_id = :userId GROUP BY status
  async getTaskStats(userId: number) {
    const tasks = await this.taskService.findTasksByUserId(userId);

    return {
      todo: tasks.filter((task) => task.status === 'TODO').length,
      inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
      done: tasks.filter((task) => task.status === 'DONE').length,
      total: tasks.length,
    };
  }

  // GET /users/:id/dashboard/workingOn
  // SQL: SELECT p.* FROM projects p JOIN project_members pm ON p.id = pm.project_id WHERE pm.user_id = :userId
  async getWorkingOn(userId: number) {
    const projects =
      await this.projectService.findProjectsWorkingOnByUserId(userId);

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      updatedAt: project.updatedAt,
      status: project.status,
      imageUrl: project.imageUrl,
    }));
  }

  // GET /users/:id/dashboard/workingWith
  // SQL:
  // SELECT DISTINCT u.*
  // FROM users u
  // JOIN team_members tm1 ON u.id = tm1.user_id
  // JOIN team_members tm2 ON tm1.team_id = tm2.team_id
  // WHERE tm2.user_id = :userId AND u.id != :userId
  async getWorkingWith(userId: number) {
    try {
      // Get teams where user is a member
      const teams = await this.teamsService.findAll();
      const userTeams = [];

      // Filter to user's teams
      for (const team of teams) {
        const members = await this.teamMembersService.listMembers(team.id);
        if (members.some((member) => member.userId === userId)) {
          userTeams.push(team);
        }
      }

      if (userTeams.length === 0) return [];

      // Track unique users across teams
      const uniqueUserMap = new Map();

      // Process each team's members
      for (const team of userTeams) {
        const members = await this.teamMembersService.listMembers(team.id);

        for (const member of members) {
          // Skip current user
          if (member.userId === userId) continue;

          // Add or update user in results map
          if (!uniqueUserMap.has(member.userId)) {
            uniqueUserMap.set(member.userId, {
              ...member.user,
              teams: [{ id: team.id, name: team.name }],
            });
          } else {
            // Add team to existing user if not already there
            const user = uniqueUserMap.get(member.userId);
            if (!user.teams.some((t) => t.id === team.id)) {
              user.teams.push({ id: team.id, name: team.name });
            }
          }
        }
      }

      return Array.from(uniqueUserMap.values());
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  }

  async getDashboardFeature(userId: number, feature: string) {
    switch (feature) {
      case 'stats':
        return this.getTaskStats(userId);
      case 'workingOn':
        return this.getWorkingOn(userId);
      case 'workingWith':
        return this.getWorkingWith(userId);
      default:
        throw new NotFoundException(`Feature "${feature}" not found`);
    }
  }
}
