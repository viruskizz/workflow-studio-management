import { MessageService } from 'primeng/api';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskStatus, TaskType } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-child-task-form',
  templateUrl: './child-task-form.component.html',
  providers: [MessageService]
})
export class ChildTaskFormComponent {
  @Input() parentTask?: Task;
  @Input() projectId?: number;
  @Input() task?: Task;
  @Output() save   = new EventEmitter<Task>();
  @Output() closed = new EventEmitter<void>();

  visible   = false;
  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private msg: MessageService,
    private taskService: TaskService
  ) {
    this.form = this.fb.group({
      summary:     ['', Validators.required],
      description: [''],
      type:        [null as TaskType|null, Validators.required],
      status:      ['TODO' as TaskStatus, Validators.required],
      assignee:    [null],
      team:        [null],
      stage:       [null]
    });
  }

  open(task?: Task): void {
    this.visible   = true;
    this.task      = task;
    this.submitted = false;

    if (task) {
      this.form.patchValue({
        summary:     task.summary,
        description: task.description,
        type:        task.type,
        status:      task.status,
        assignee:    task.assignee,
        team:        task.team,
        stage:       task.stage
      });
    } else {
      this.form.reset({
        status: 'TODO',
        type:   this.getChildTaskType(this.parentTask?.type)
      });
    }
  }

  onHide(): void {
    this.form.reset();
    this.visible   = false;
    this.submitted = false;
    this.closed.emit();
  }

  onSave() {
    this.submitted = true;
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const baseData = {
      summary: formValue.summary,
      description: formValue.description,
      type: formValue.type,
      status: formValue.status,
      assigneeId: formValue.assignee?.id,
      teamId: formValue.team?.id,
      stageId: formValue.stage?.id,
      parentId: this.parentTask?.id
    };

    const taskData = this.task?.id ? 
      baseData : 
      { ...baseData, projectId: this.projectId };

    const op$ = this.task?.id ? 
      this.taskService.updateTask(this.task.id, taskData) :
      this.taskService.createTask(taskData);

    op$.subscribe({
      next: (savedTask) => {
        this.msg.add({
          severity: 'success',
          summary: 'Success',
          detail: `Task ${this.task?.id ? 'updated' : 'created'} successfully`
        });
        this.save.emit(savedTask);
        this.onHide();
      },
      error: (err) => {
        this.msg.add({
          severity: 'error',
          summary: 'Error', 
          detail: err.message || `Failed to ${this.task?.id ? 'update' : 'create'} task`
        });
      }
    });
  }

  onStatusChange(status: TaskStatus): void {
    this.form.patchValue({ status });
  }

  private getChildTaskType(parentType?: TaskType): TaskType | null {
    const types: TaskType[] = ['EPIC','STORY','TASK','SUBTASK'];
    const idx = parentType ? types.indexOf(parentType) : -1;
    return idx >= 0 && idx < types.length - 1
      ? types[idx + 1]
      : null;
  }
}
