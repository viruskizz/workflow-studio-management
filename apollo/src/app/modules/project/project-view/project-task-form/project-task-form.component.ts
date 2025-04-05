import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-project-task-form',
  templateUrl: './project-task-form.component.html',
})
export class ProjectTaskFormComponent {
  @Input() task?: Task;
  @Output() taskChange = new EventEmitter<Task>();

  @Output() onCloseEvent = new EventEmitter<Task | null>();

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  projectTaskForm = new FormGroup({
    team: new FormControl('', [Validators.required]),
    assignee: new FormControl('', []),
    date: new FormControl('', []),
  })

  constructor() {}


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
}
