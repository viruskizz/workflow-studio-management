import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileSelectEvent } from 'primeng/fileupload';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-project-task-form',
  templateUrl: './project-task-form.component.html',
})
export class ProjectTaskFormComponent {
  @Input() task?: Task;
  @Output() taskChange = new EventEmitter<Task>();
  @Output() onCloseEvent = new EventEmitter<Task | null>();
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  imagePreview?: string = 'assets/images/noimage.jpg';
  coverFile?: File;

  projectTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    link: new FormControl('', []),
    files: new FormControl([], []),
    status: new FormControl('', [Validators.required]),
    date: new FormControl('', []),
    team: new FormControl('', [Validators.required]),
    assignee: new FormControl('', []),
    state: new FormControl('', []),
    flow: new FormControl('', []),
    parent: new FormControl('', []),
    description: new FormControl('', []),
  })

  constructor() { }


  onCancel() {
    this.visible = false;
  }

  onHide() {
    this.visible = false;
    this.onCloseEvent.emit(null)
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
  }
}
