import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Task, TaskType, TaskStatus } from 'src/app/models/task.model';
import { MessageService } from 'primeng/api';
import { Project } from 'src/app/models/project.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-task-detail-dialog',
  templateUrl: './task-detail-dialog.component.html',
  providers: [MessageService]
})
export class TaskDetailDialogComponent implements OnInit {
  @Input() projectId!: number;
  @Input() task?: Task;
  @Input() project?: Project;
  @Input() childTasks: Task[] = [];

  @Output() save = new EventEmitter<Task>();
  @Output() dialogClose = new EventEmitter<void>();

  projectTaskForm: FormGroup;
  visible = false;
  submitted = false;

  // Add BehaviorSubject to track changes
  private taskSubject = new BehaviorSubject<Task | null>(null);
  task$ = this.taskSubject.asObservable();

  constructor(private messageService: MessageService, private dashboardService: DashboardService) {
    this.projectTaskForm = new FormGroup({
      summary: new FormControl('', Validators.required),
      type: new FormControl<TaskType | null>(null, [Validators.required]),
      status: new FormControl<TaskStatus | null>(null, [Validators.required]),
      description: new FormControl(''),
      date: new FormControl(''),
      team: new FormControl(null),
      assignee: new FormControl(null),
      stage: new FormControl(null),
      parentId: new FormControl(null),
    });
  }

  activityViewOptions = [
    { label: 'All', value: 'all' },
    { label: 'Comments', value: 'comments' },
    { label: 'History', value: 'history' },
    { label: 'Worklog', value: 'worklog' }
  ];
  selectedActivityView = 'all';

  comments: {
    author: { firstName: string; lastName: string; imageUrl?: string };
    date: string | Date;
    text: string;
  }[] = [];

  getTagSeverity(status: TaskStatus): string {
    switch (status) {
    case 'BACKLOG': return 'secondary';
    case 'TODO': return 'info';
    case 'IN_PROGRESS': return 'warning';
    case 'DONE': return 'success';
    case 'CANCELLED': return 'danger';
    default: return 'info';
    }
  }

  getTaskStatusLabel(status: TaskStatus): string {
    switch (status) {
    case 'BACKLOG': return 'Backlog';
    case 'TODO': return 'Todo';
    case 'IN_PROGRESS': return 'In Progress';
    case 'DONE': return 'Done';
    case 'CANCELLED': return 'Cancelled';
    default: return status;
    }
  }

  getTaskStatusIcon(status: TaskStatus): { icon: string } {
    switch (status) {
    case 'BACKLOG': return { icon: 'pi pi-clock' };
    case 'TODO': return { icon: 'pi pi-list' };
    case 'IN_PROGRESS': return { icon: 'pi pi-spin pi-spinner' };
    case 'DONE': return { icon: 'pi pi-check' };
    case 'CANCELLED': return { icon: 'pi pi-times' };
    default: return { icon: 'pi pi-question' };
    }
  }

  getImage(url?: string): string {
    return url || 'assets/images/noimage.jpg';
  }

  get computedProgress(): number {
    if (!this.childTasks || this.childTasks.length === 0) {
      return 0;
    }
    const DONE_STATUS: TaskStatus = 'DONE';
    const doneCount = this.childTasks.filter((t: Task) => t.status === DONE_STATUS).length;
    return Math.round((doneCount / this.childTasks.length) * 100);
  }

  ngOnInit(): void {
    if (this.task) {
      this.visible = true;
      this.projectTaskForm.patchValue(this.task);
    }
  }

  open(task: Task, project?: Project, childTasks?: Task[]) {
    this.task = { ...task };
    this.project = project;
    this.childTasks = childTasks || [];
    this.visible = true;
    this.taskSubject.next(this.task);
    this.patchForm();
  }

  patchForm() {
    if (!this.task) return;
    this.projectTaskForm.patchValue({
      summary: this.task.summary,
      type: this.task.type,
      status: this.task.status,
      description: this.task.description,
      team: this.task.team,
      assignee: this.task.assignee ? [this.task.assignee] : [],
      stage: this.task.stage,
      parentId: this.task.parentId ?? null,
    });
  }

  onHide() {
    this.visible = false;
    this.dialogClose.emit();
  }

  onSave() {
    this.submitted = true;
    if (this.projectTaskForm.invalid) {
      this.projectTaskForm.markAllAsTouched();
      return;
    }
    const formValue = this.projectTaskForm.value;
    const updated: Task = {
      ...this.task!,
      ...formValue,
      assignee: Array.isArray(formValue.assignee) ? formValue.assignee[0] : formValue.assignee,
      status: formValue.status,
      parentId: formValue.parentId,
      projectId: this.project?.id ?? this.task?.projectId
    };
    this.save.emit(updated);
    this.visible = false;
    this.submitted = false;
  }

  onStatusChange(newStatus: TaskStatus) {
    if (!this.task?.id || !this.task.assigneeId) return;
    
    this.dashboardService.updateTaskStatus(this.task.assigneeId, this.task.id, newStatus).subscribe({
      next: () => {
        this.task = {
          ...this.task!,
          status: newStatus
        };
        this.projectTaskForm.patchValue({ status: newStatus });
        this.save.emit(this.task);
        this.taskSubject.next(this.task);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Task status updated to ${newStatus}`
        });
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task status'
        });
      }
    });
  }

  get status() { return this.projectTaskForm.get('status'); }
  get team() { return this.projectTaskForm.get('team'); }
}
