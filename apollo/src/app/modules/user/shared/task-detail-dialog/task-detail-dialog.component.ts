import { BehaviorSubject } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskStatus, TaskType } from 'src/app/models/task.model';
import { Project } from 'src/app/models/project.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TaskService } from 'src/app/services/task.service';
import { ChildTaskFormComponent } from './child-task-form/child-task-form.component';

const STATUS_META: Record<TaskStatus, { label: string; severity: string; icon: string }> = {
  BACKLOG: { label: 'Backlog', severity: 'secondary', icon: 'pi pi-clock' },
  TODO: { label: 'Todo', severity: 'info', icon: 'pi pi-list' },
  IN_PROGRESS: { label: 'In Progress', severity: 'warning', icon: 'pi pi-spin pi-spinner' },
  DONE: { label: 'Done', severity: 'success', icon: 'pi pi-check' },
  CANCELLED: { label: 'Cancelled', severity: 'danger', icon: 'pi pi-times' }
};

@Component({
  selector: 'app-task-detail-dialog',
  templateUrl: './task-detail-dialog.component.html',
  providers: [MessageService, ConfirmationService]
})
export class TaskDetailDialogComponent implements OnInit {
  @Input() projectId!: number;
  @Input() task?: Task;
  @Input() project?: Project;
  @Input() childTasks: Task[] = [];

  @Output() save = new EventEmitter<Task>();
  @Output() dialogClose = new EventEmitter<void>();

  @ViewChild('childDialog') childDialog?: ChildTaskFormComponent;

  form: FormGroup;
  visible = false;
  submitted = false;
  comments: any[] = [];
  private taskSubject = new BehaviorSubject<Task | null>(null);
  task$ = this.taskSubject.asObservable();

  activityViewOptions = [
    { label: 'All', value: 'all' },
    { label: 'Comments', value: 'comments' },
    { label: 'History', value: 'history' },
    { label: 'Worklog', value: 'worklog' }
  ];

  constructor(
    fb: FormBuilder,
    private msg: MessageService,
    private confirm: ConfirmationService,
    private dash: DashboardService,
    private tasks: TaskService,
  ) {
    this.form = fb.group({
      summary:     ['', Validators.required],
      description: [''],
      type:        [null as TaskType|null, Validators.required],
      status:      [null as TaskStatus|null, Validators.required],
      team:        [null],
      assignee:    [null],
      stage:       [null],
      parentId:    [null],
      activityView:['all']
    });
  }

  ngOnInit() {
    if (this.task) {
      this.open(this.task, this.project, this.childTasks);
    }
  }

  open(task: Task, project?: Project, children: Task[] = []) {
    this.task = { ...task };
    this.project = project;
    this.childTasks = children;
    this.visible = true;
    this.taskSubject.next(this.task);
    this.form.patchValue({
      summary:     task.summary,
      description: task.description,
      type:        task.type,
      status:      task.status,
      team:        task.team,
      assignee:    task.assignee,
      stage:       task.stage,
      parentId:    task.parentId,
      activityView:'all'
    });
  }

  getProgress(): number {
    if (!this.childTasks.length) return 0;
    const done = this.childTasks.filter(t => t.status === 'DONE').length;
    return Math.round((done / this.childTasks.length) * 100);
  }

  getMeta(status: TaskStatus) {
    return STATUS_META[status] ?? STATUS_META.TODO;
  }

  imageUrl(url?: string) {
    return url ?? 'assets/images/noimage.jpg';
  }

  onHide() {
    this.visible = false;
    this.dialogClose.emit();
  }

  onSave() {
    this.submitted = true;
    if (this.form.invalid || !this.task?.id) {
      this.form.markAllAsTouched();
      return;
    }

    const fv = this.form.value;
    const dto = {
      summary:    fv.summary,
      description:fv.description,
      type:       fv.type as TaskType,
      status:     fv.status as TaskStatus,
      assigneeId: fv.assignee?.id ?? null,
      teamId:     fv.team?.id ?? null,
      stageId:    fv.stage?.id ?? null,
      parentId:   fv.parentId ?? this.task.parentId!
    };

    this.tasks.updateTask(this.task.id, dto).subscribe({
      next: updatedTask => {
        this.task = updatedTask;
        this.taskSubject.next(this.task);
        this.msg.add({ severity: 'success', summary: 'Success', detail: 'Task updated successfully' });
        this.save.emit(this.task);
        this.visible = this.submitted = false;
      },
      error: err => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to update task' });
      }
    });
  }

  onStatusChange(newStatus: TaskStatus) {
    if (!this.task?.id || !this.task.assigneeId) return;

    this.dash.updateTaskStatus(this.task.assigneeId, this.task.id, newStatus)
      .subscribe({
        next: () => {
          this.task!.status = newStatus;
          this.form.patchValue({ status: newStatus });
          this.save.emit(this.task!);
          this.taskSubject.next(this.task!);
          this.msg.add({ severity: 'success', summary: 'Success', detail: `Status updated to ${newStatus}` });
        },
        error: () => {
          this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
        }
      });
  }

  createChildTask() {
    if (!this.task?.id || !this.project?.id) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: 'Parent & project required' });
      return;
    }
    this.childDialog!.open(undefined);
  }

  onChildTaskSave(saved: Task) {
    const idx = this.childTasks.findIndex(t => t.id === saved.id);
    if (idx > -1) {
      this.childTasks[idx] = saved;
    } else {
      this.childTasks.push(saved);
    }    
    
    this.childTasks = [...this.childTasks];

    this.msg.add({ severity: 'success', summary: 'Success', detail: `Child task ${saved.id ? 'updated' : 'created'}` });
  }

  onDeleteChild(id: number) {
    this.confirm.confirm({
      message: 'Are you sure you want to delete this task?',
      accept: () => {
        this.tasks.deleteTask(id).subscribe({
          next: () => {
            this.childTasks = this.childTasks.filter(t => t.id !== id);
            this.msg.add({ severity: 'success', summary: 'Deleted', detail: 'Child task removed' });
          },
          error: e => this.msg.add({ severity: 'error', summary: 'Error', detail: e.message })
        });
      }
    });
  }

  onEditChild(child: Task) {
    this.childDialog?.open(child);
  }

  get statusCtrl() { return this.form.get('status'); }
  get teamCtrl()   { return this.form.get('team'); }
  get stageCtrl()  { return this.form.get('stage'); }
}
