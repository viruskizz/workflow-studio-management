import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { FileSelectEvent } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project.model';
import { Task, TaskStatus, TaskType } from 'src/app/models/task.model';
import { Team, TeamStage } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { TaskService } from 'src/app/services/task.service';
import { AppState, ProjectActions } from 'src/app/store';

@Component({
  selector: 'app-project-task-form',
  templateUrl: './project-task-form.component.html',
})
export class ProjectTaskFormComponent implements OnChanges {
  @Input({ required: true }) mode?: string | 'CREATE' | 'EDIT';
  @Input({ required: true }) project?: Partial<Project>;
  @Input() task?: Partial<Task>;
  @Output() taskChange = new EventEmitter<Task | undefined>();
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeEvent = new EventEmitter<Task | null>();

  @ViewChild('inputTitle') inputTitle!: ElementRef;

  imagePreview?: string = 'assets/images/noimage.jpg';
  coverFile?: File;

  submitted = false;
  taskId?: number;

  projectTaskForm = new FormGroup({
    summary: new FormControl('', [Validators.required]),
    type: new FormControl<TaskType | undefined>(undefined, [Validators.required]),
    status: new FormControl<TaskStatus | undefined>(undefined, [Validators.required]),
    description: new FormControl('', []),
    date: new FormControl('', []),
    team: new FormControl<Team | undefined>(undefined, []),
    assignee: new FormControl<User | null>(null, []),
    stage: new FormControl<TeamStage | undefined>(undefined, []),
    flow: new FormControl('', []),
    parentId: new FormControl<number | undefined>(undefined, []),
    files: new FormControl([], []),
  });

  constructor(
    private taskService: TaskService,
    private messageService: MessageService,
    private store: Store<AppState>,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']?.currentValue) {
      this.taskId = changes['task']?.currentValue.id;
      this.projectTaskForm.reset()
      this.projectTaskForm.patchValue(changes['task']?.currentValue)
    }
  }

  focus(field: string) {
    if (field === 'inputTitle') {
      setTimeout(() => this.inputTitle.nativeElement.focus(), 1);
    }
  }

  onHide() {
    this.task = undefined;
    this.taskChange.emit(undefined);
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onUpload() {
    console.log('Uploading')
  }

  onSelectImage(event: FileSelectEvent) {
    const file = event.currentFiles[0];
    if (file) {
      this.coverFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.imagePreview = event.target?.result as string;
      }
    }
  }

  onSave() {
    this.submitted = true;
    if (!this.projectTaskForm.controls.summary.value) {
      this.projectTaskForm.controls.summary.patchValue('Untitled')
    }
    if (this.projectTaskForm.invalid) {
      return;
    }
    const value = this.projectTaskForm.value;
    const body: Partial<Task> = {
      projectId: this.project!.id,
      code: '1',
      summary: value.summary as string,
      description: value.description as string | undefined,
      type: value.type!,
      status: value.status as TaskStatus,
      teamId: value.team?.id,
      stageId: value.stage?.id,
      parentId: value.parentId as number | undefined,
      assigneeId: value.assignee ? value.assignee.id : undefined,
    }
    let event: Observable<Task>;
    if (this.mode === 'EDIT' && this.taskId) {
      body.id = this.taskId;
      body.code = undefined;
      body.projectId = undefined;
      event = this.taskService.updateTask(this.taskId, body);
    } else {
      event = this.taskService.create(body);
    }
    event.subscribe({
      next: (v) => this.onSaveSuccess(v),
      error: (e) => this.onSaveError(e),
    })
  }

  private onSaveSuccess(task: Task) {
    this.visible = false;
    this.task = task;
    this.taskChange.emit(task);
    this.visibleChange.emit(false);
    this.store.dispatch(ProjectActions.loadTasksTree({ projectId: this.task.projectId! }));
  }

  private onSaveError(e: any) {
    console.error(e);
    const err = e.error;
    const msgTemplate = {
      key: 'projectTaskForm',
      severity: 'error',
      summary: err.error || 'Error',
      life: 6 * 1000,
      sticky: true,
    };
    if (Array.isArray(err.message)) {
      this.messageService.addAll(err.message.map((msg: string) => ({
        ...msgTemplate,
        detail: msg
      })))
    } else {
      this.messageService.add({
        ...msgTemplate,
        detail: err.message
      })
    }
  }

  get type() { return this.projectTaskForm.controls.type; }
  get description() { return this.projectTaskForm.controls.description; }
  get status() { return this.projectTaskForm.controls.status; }
  get team() { return this.projectTaskForm.controls.team; }
}
