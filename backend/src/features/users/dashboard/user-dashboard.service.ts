import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserDashboard } from '@backend/typeorm';
import { TasksService } from '@backend/features/tasks/tasks.service';
import { ProjectsService } from '@backend/features/projects/projects.service';
import { TeamsService } from '@backend/features/teams/teams.service';
import { TeamMembersService } from '@backend/features/teams/members/team-members.service';

@Injectable()
export class UserDashboardService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserDashboard)
    private dashboardRepository: Repository<UserDashboard>,
    private taskService: TasksService,
    private projectService: ProjectsService,
    private teamsService: TeamsService,
    private teamMembersService: TeamMembersService,
  ) {}

  getRepository() {
    return this.usersRepository;
  }

  async getDashboardSummary(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Try to find existing dashboard data
    let dashboard = await this.dashboardRepository.findOne({
      where: { userId },
    });

    // If no dashboard exists, generate one and save it
    if (!dashboard) {
      const [taskStats, workingOn, workingWith] = await Promise.all([
        this.getTaskStats(userId),
        this.getWorkingOn(userId),
        this.getWorkingWith(userId),
      ]);

      dashboard = this.dashboardRepository.create({
        userId,
        taskStats,
        workingOn,
        workingWith,
      });

      await this.dashboardRepository.save(dashboard);
    }

    return {
      user,
      taskStats: dashboard.taskStats,
      workingOn: dashboard.workingOn,
      workingWith: dashboard.workingWith,
    };
  }

  async getTaskStats(userId: number) {
    const tasks = await this.taskService.findTasksByUserId(userId);

    return {
      todo: tasks.filter((task) => task.status === 'TODO').length,
      inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
      done: tasks.filter((task) => task.status === 'DONE').length,
      total: tasks.length,
    };
  }

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
