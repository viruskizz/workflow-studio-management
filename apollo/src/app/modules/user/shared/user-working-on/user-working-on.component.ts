import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectWithTasks } from 'src/app/models/project.model';
import { Task, TaskStatus, TaskType } from 'src/app/models/task.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TaskService } from 'src/app/services/task.service';
import { AppStyleUtil } from 'src/app/utils/app-style.util';
import { getDefaultAvatar } from 'src/app/utils';
import { MessageService } from 'primeng/api';
import { TaskDetailDialogComponent } from '../task-detail-dialog/task-detail-dialog.component';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-user-working-on',
  templateUrl: './user-working-on.component.html',
  providers: [MessageService],
})
export class UserWorkingOnComponent implements OnInit {
  @Input() styleClass = '';
  @Input() userId?: number;
  @Input() projects: ProjectWithTasks[] = [];

  @Output() save = new EventEmitter<Task>();

  @ViewChild('taskDetail') taskDetail!: TaskDetailDialogComponent;

  selectedProjectId!: number;
  visible = false;
  task?: Task;

  private readonly MAIN_TASK_TYPES: TaskType[] = ['EPIC', 'STORY', 'TASK'];

  constructor(
    private dashboardService: DashboardService,
    private taskService: TaskService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.userId && this.projects.length === 0) {
      this.refreshTasks();
    }
  }

  refreshTasks(): void {
    if (!this.userId) return;

    this.dashboardService.getWorkingOn(this.userId).subscribe(projects => {
      this.projects = projects;
    });
  }

  navigateToTask(projectId: number, taskId: number): void {
    this.router.navigate(['/projects', projectId], {
      queryParams: { taskId }
    });
  }

  updateTaskStatus(taskId: number, status: TaskStatus, projectIndex: number, taskIndex: number): void {
    const currentTask = this.validateTaskUpdate(projectIndex, taskIndex);
    if (!currentTask) return;

    const updateData = this.getUpdateData(currentTask, status);

    this.taskService.updateTask(taskId, updateData).subscribe({
      next: updatedTask => {
        this.updateLocalTaskState(projectIndex, taskIndex, updatedTask);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Task status updated to ${status}`
        });
      },
      error: error => {
        console.error('Error updating task:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task status'
        });
      }
    });
  }

  openDetail(projectId: number, task: Task): void {
    this.selectedProjectId = projectId;
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      this.taskDetail.open(task, project, (project.tasks ?? []).filter(t => t.parentId === task.id));
    }
  }

  onDetailSave(updated: Task): void {
    this.refreshTasks();
    this.messageService.add({
      severity: 'success',
      summary: 'Task Updated',
      detail: `Task "${updated.summary}" has been updated.`
    });
  }

  showStatusMenu(event: Event, menu: Menu, taskId: number, projectIndex: number, taskIndex: number): void {
    menu.model = this.getStatusMenuItems(taskId, projectIndex, taskIndex);
    menu.toggle(event);
  }

  onImageError(projectIndex: number): void {
    this.projects[projectIndex].imageUrl = 'assets/images/noimage.jpg';
  }

  onAssigneeImageError(projectIndex: number, taskIndex: number): void {
    const assignee = this.projects[projectIndex]?.tasks?.[taskIndex]?.assignee;
    if (assignee) {
      assignee.imageUrl = getDefaultAvatar();
    }
  }

  getImage(url: string): string {
    return url || 'assets/images/noimage.jpg';
  }

  getTaskStatusIcon(status: TaskStatus) {
    return AppStyleUtil.getTaskStatusIcon(status);
  }

  getTagSeverity(status: TaskStatus): string {
    const map: Record<TaskStatus, string> = {
      BACKLOG: 'secondary',
      TODO: 'info',
      IN_PROGRESS: 'warning',
      DONE: 'success',
      CANCELLED: 'danger'
    };
    return map[status] || 'info';
  }

  filterMainTasks(tasks: Task[]): Task[] {
    return tasks.filter(task => this.MAIN_TASK_TYPES.includes(task.type));
  }

  private validateTaskUpdate(projectIndex: number, taskIndex: number): Task | null {
    if (!this.userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User ID is required to update task status'
      });
      return null;
    }

    const task = this.projects[projectIndex]?.tasks?.[taskIndex];
    if (!task) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Task not found'
      });
      return null;
    }

    return task;
  }

  private getUpdateData(task: Task, status: TaskStatus) {
    return {
      status,
      summary: task.summary,
      type: task.type,
      description: task.description,
      assigneeId: task.assignee?.id,
      parentId: task.parentId
    };
  }

  private updateLocalTaskState(projectIndex: number, taskIndex: number, updatedTask: Task): void {
    const project = this.projects[projectIndex];
    if (!project || !project.tasks) return;

    const updatedProjects = [...this.projects];
    const updatedTasks = [...project.tasks];
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], status: updatedTask.status };

    updatedProjects[projectIndex] = { ...project, tasks: updatedTasks };
    this.projects = updatedProjects;
  }

  private getStatusMenuItems(taskId: number, projectIndex: number, taskIndex: number) {
    const statuses: TaskStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'];
    return [
      {
        label: 'Update Status',
        items: statuses.map(status => ({
          label: this.getTaskStatusIcon(status).label,
          icon: this.getTaskStatusIcon(status).icon,
          command: () => this.updateTaskStatus(taskId, status, projectIndex, taskIndex)
        }))
      }
    ];
  }
}

