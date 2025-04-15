import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileSelectEvent } from 'primeng/fileupload';
import { Task } from 'src/app/models/task.model';
import { TaskTypeDropdownItem } from 'src/app/shared/components/forms/task-type/task-type.component';

@Component({
  selector: 'app-project-task-form',
  templateUrl: './project-task-form.component.html',
})
export class ProjectTaskFormComponent implements OnChanges {
  @Input() task?: Partial<Task>;
  @Output() taskChange = new EventEmitter<Task>();
  @Output() closeEvent = new EventEmitter<Task | null>();
  @Input() visible = true;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'].currentValue) {
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
    console.log(this.projectTaskForm)
    console.log(this.projectTaskForm.value)
    // this.visible = false;
    // this.taskService
    this.submitted = true;
  }

  get type() { return this.projectTaskForm.controls.type; }
  get description() {  return this.projectTaskForm.controls.description; }
  get status() { return this.projectTaskForm.controls.status; }
}
