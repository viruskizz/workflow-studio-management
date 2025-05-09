import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, User } from '@backend/typeorm';
import {
  TaskStats,
  UserDashboard,
  UserTeam,
} from '@backend/interfaces/user-dashboard.interface';
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
  async getDashboardSummary(userId: number): Promise<UserDashboard> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get all dashboard data in parallel
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
  async getTaskStats(userId: number): Promise<TaskStats> {
    const tasks = await this.taskService.findTasksByUserId(userId);

    return {
      todo: tasks.filter((task) => task.status === 'TODO').length,
      inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
      done: tasks.filter((task) => task.status === 'DONE').length,
      total: tasks.length,
    };
  }

  // GET /users/:id/dashboard/workingOn
  async getWorkingOn(userId: number): Promise<any[]> {
    // Get tasks for the user
    const tasks = await this.taskService.findTasksByUserId(userId);

    // Extract unique projects from tasks
    const projectIds = [
      ...new Set(tasks.map((task) => task.projectId).filter(Boolean)),
    ];

    if (projectIds.length === 0) {
      return [];
    }

    // Get full project details for each project ID
    const projects = await Promise.all(
      projectIds.map((id) => this.projectService.findOne(id)),
    );

    // For each project, add its tasks but remove circular references
    const projectsWithTasks = projects.filter(Boolean).map((project) => {
      // Find tasks for this project
      const projectTasks = tasks
        .filter((task) => task.projectId === project.id)
        .map((task) => {
          // Create a clean copy of the task without the project reference
          const { project: _, ...taskWithoutProject } = task;
          return taskWithoutProject;
        });

      // Return a new object with the project properties and tasks
      return {
        ...project,
        tasks: projectTasks,
      };
    });

    return projectsWithTasks;
  }

  // GET /users/:id/dashboard/workingWith
  async getWorkingWith(userId: number): Promise<UserTeam[]> {
    try {
      // Get all teams
      const teams = await this.teamsService.findAll();
      const userTeams = [];

      // Filter to user's teams (as member or leader)
      for (const team of teams) {
        const members = await this.teamMembersService.listMembers(team.id);

        // Include team if user is a member OR a leader
        if (
          members.some((member) => member.userId === userId) ||
          team.leaderId === userId
        ) {
          // Add members to the team object, excluding the current user
          userTeams.push({
            ...team,
            members: members
              .map((member) => member.user)
              .filter((user) => user.id !== userId),
          });
        }
      }

      return userTeams;
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
