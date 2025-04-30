import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-team-detail-project-working',
  templateUrl: './team-detail-project-working.component.html',
})
export class TeamDetailProjectWorkingComponent implements OnInit {
  @Input() teamId!: number;
  
  projects: Project[] = [];
  loading = false;
  
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    if (this.teamId) {
      this.loadProjects();
    }
  }

  loadProjects(): void {
    this.loading = true;
    
    // Get projects for the specific team
    this.projectService.listProject().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading team projects', err);
        this.loading = false;
        // Fallback to empty array
        this.projects = [];
      }
    });
  }

  getProgress(project: any): number {
    // Calculate progress based on completed tasks vs total tasks
    if (!project.tasks || project.tasks.length === 0) {
      return 0;
    }
    
    const completedTasks = project.tasks.filter((task: { status: string }) => task.status === 'COMPLETED').length;    return Math.round((completedTasks / project.tasks.length) * 100);
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
