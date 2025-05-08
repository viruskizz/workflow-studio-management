import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectWithTasks } from 'src/app/models/project.model';
import { TaskStatus } from 'src/app/models/task.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AppStyleUtil } from 'src/app/utils/app-style.util';
import { getDefaultAvatar } from 'src/app/utils';

@Component({
  selector: 'app-user-working-on',
  templateUrl: './user-working-on.component.html'
})
export class UserWorkingOnComponent implements OnInit {
  @Input() styleClass = '';
  @Input() userId?: number;
  @Input() projects: ProjectWithTasks[] = [];

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.userId && this.projects.length === 0) {
      this.dashboardService.getWorkingOn(this.userId).subscribe(
        projects => {
          this.projects = projects;
          // console.log('Projects fetched for user', this.userId, projects);
        },
      );
    }
  }

  navigateToTask(projectId: number, taskId: number) {
    // Navigate to the project view with the task selected
    this.router.navigate(['/projects', projectId], { 
      queryParams: { taskId: taskId }
    });
  }

  onImageError(projectIndex: number) {
    if (this.projects[projectIndex]) {
      this.projects[projectIndex].imageUrl = 'assets/images/noimage.jpg';
    }
  }
  
  onAssigneeImageError(projectIndex: number, taskIndex: number) {
    const assignee = this.projects[projectIndex]?.tasks?.[taskIndex]?.assignee;
    if (assignee) {
      assignee.imageUrl = getDefaultAvatar();
    }
  }
    
  getImage(url: string) {
    return url || 'assets/images/noimage.jpg';
  }

  getTaskStatusIcon(status: TaskStatus) {
    return AppStyleUtil.getTaskStatusIcon(status);
  }
  
  getTagSeverity(status: TaskStatus): string {
    switch (status) {
    case 'BACKLOG':
      return 'secondary';
    case 'TODO':
      return 'info';
    case 'IN_PROGRESS':
      return 'warning';
    case 'DONE':
      return 'success';
    case 'CANCELLED':
      return 'danger';
    default:
      return 'info';
    }
  }
}
