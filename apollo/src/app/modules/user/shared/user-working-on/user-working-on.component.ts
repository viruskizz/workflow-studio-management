import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectWithTasks } from 'src/app/models/project.model';
import { TaskStatus } from 'src/app/models/task.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AppStyleUtil } from 'src/app/utils/app-style.util';
import { getDefaultAvatar } from 'src/app/utils';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-working-on',
  templateUrl: './user-working-on.component.html',
  providers: [MessageService],
})
export class UserWorkingOnComponent implements OnInit {
  @Input() styleClass = '';
  @Input() userId?: number;
  @Input() projects: ProjectWithTasks[] = [];


  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    if (this.userId && this.projects.length === 0) {
      this.dashboardService.getWorkingOn(this.userId).subscribe(
        projects => {
          this.projects = projects;
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

  updateTaskStatus(taskId: number, status: TaskStatus, projectIndex: number, taskIndex: number) {
    if (!this.userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User ID is required to update task status'
      });
      return;
    }

    this.dashboardService.updateTaskStatus(this.userId, taskId, status).subscribe({
      next: () => {
        // Update the task in the local array
        const project = this.projects[projectIndex];
        if (project && project.tasks && project.tasks[taskIndex]) {
          project.tasks[taskIndex].status = status;
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Task status updated to ${status}`
        });
      },
      error: (error: Error) => {
        console.error('Error updating task status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task status'
        });
      }
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

  getStatusMenuItems(taskId: number, projectIndex: number, taskIndex: number) {
    return [
      {
        label: 'Update Status',
        items: [
          {
            label: 'Backlog',
            icon: this.getTaskStatusIcon('BACKLOG').icon,
            command: () => this.updateTaskStatus(taskId, 'BACKLOG', projectIndex, taskIndex)
          },
          {
            label: 'Todo',
            icon: this.getTaskStatusIcon('TODO').icon,
            command: () => this.updateTaskStatus(taskId, 'TODO', projectIndex, taskIndex)
          },
          {
            label: 'In Progress',
            icon: this.getTaskStatusIcon('IN_PROGRESS').icon,
            command: () => this.updateTaskStatus(taskId, 'IN_PROGRESS', projectIndex, taskIndex)
          },
          {
            label: 'Done',
            icon: this.getTaskStatusIcon('DONE').icon,
            command: () => this.updateTaskStatus(taskId, 'DONE', projectIndex, taskIndex)
          },
          {
            label: 'Cancelled',
            icon: this.getTaskStatusIcon('CANCELLED').icon,
            command: () => this.updateTaskStatus(taskId, 'CANCELLED', projectIndex, taskIndex)
          }
        ]
      }
    ];
  }
}
