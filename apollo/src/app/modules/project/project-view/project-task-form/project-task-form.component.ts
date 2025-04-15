import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileSelectEvent } from 'primeng/fileupload';
import { Project } from 'src/app/models/project.model';
import { Task, TaskStatus } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { TaskTypeDropdownItem } from 'src/app/shared/components/forms/task-type/task-type.component';

@Component({
  selector: 'app-project-task-form',
  templateUrl: './project-task-form.component.html',
})
export class ProjectTaskFormComponent implements OnChanges {
  @Input() project?: Partial<Project>;
  @Input() task?: Partial<Task>;
  @Output() taskChange = new EventEmitter<Task>();
  @Output() closeEvent = new EventEmitter<Task | null>();
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @ViewChild('inputTitle') inputTitle!: ElementRef;

  imagePreview?: string = 'assets/images/noimage.jpg';
  coverFile?: File;

  submitted = false;

  projectTaskForm = new FormGroup({
    summary: new FormControl('', [Validators.required]),
    type: new FormControl<TaskTypeDropdownItem | null>(null, [Validators.required]),
    status: new FormControl('', [Validators.required]),
    description: new FormControl('', []),
    date: new FormControl('', []),
    team: new FormControl('', []),
    assignee: new FormControl('', []),
    state: new FormControl('', []),
    flow: new FormControl('', []),
    parent: new FormControl('', []),
    files: new FormControl([], []),
  });

  constructor(
    private taskService: TaskService,
    private messageService: MessageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']?.currentValue) {
      this.visible = true;
    }
  }

  focus(field: string) {
    if (field === 'inputTitle') {
      setTimeout(() => this.inputTitle.nativeElement.focus(), 1);
    }
  }

  close() {
    this.task = undefined;
    this.taskChange.emit(undefined);
    this.visible = false;
  }

  onHide() {
    this.task = undefined;
    this.taskChange.emit(undefined);
    this.visible = false;
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
    console.log(this.projectTaskForm.value)
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
      description: value.description as  | undefined,
      type: value.type!.value,
      status: value.status as TaskStatus,
    }
    this.taskService.create(body).subscribe({
      next: (v) => {
        console.log(v);
        this.visible = false;
      },
      error: (e) => {
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
    })
  }

  get type() { return this.projectTaskForm.controls.type; }
  get description() {  return this.projectTaskForm.controls.description; }
  get status() { return this.projectTaskForm.controls.status; }
}
