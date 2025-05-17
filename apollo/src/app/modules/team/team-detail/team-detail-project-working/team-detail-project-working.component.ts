import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { Team } from 'src/app/models/team.model';
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-detail-project-working',
  templateUrl: './team-detail-project-working.component.html',
})
export class TeamDetailProjectWorkingComponent implements OnChanges {
  @Input({ required: true }) teamId!: number;

  team?: Team;
  projects: Project[] = [];
  loading = false;

  constructor(
    private projectService: ProjectService,
    private teamService: TeamService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teamId'] && changes['teamId'].currentValue) {
      this.teamId = changes['teamId'].currentValue;
      this.loadProjects();
    }
  }

  loadProjects(): void {
    this.loading = true;

    // First get the team to access the leaderId
    this.teamService.getTeamWithMembers(this.teamId).subscribe({
      next: (team) => {
        this.team = team;

        // Then load projects
        this.projectService.listProject().subscribe({
          next: (projects) => {
            // Filter projects where the team leader is the project leader
            this.projects = projects.filter(project => {
              return project.leaderId === this.team?.leaderId;
            });
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading team projects', err);
            this.loading = false;
            this.projects = [];
          }
        });
      },
      error: (err) => {
        console.error('Error loading team details', err);
        this.loading = false;
      }
    });
  }

  getProgress(project: any): number {
    // Calculate progress based on completed tasks vs total tasks
    if (!project.tasks || project.tasks.length === 0) {
      return 0;
    }

    const completedTasks = project.tasks.filter((task: { status: string }) => task.status === 'COMPLETED').length; return Math.round((completedTasks / project.tasks.length) * 100);
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusFromProject(project: any): string {
    switch (project.status) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'PENDING':
        return 'Pending';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return project.status;
    }
  }

  getSeverityFromStatus(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  }
}
