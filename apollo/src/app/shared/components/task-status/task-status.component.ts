import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup} from '@angular/forms';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
})
export class TaskStatusComponent {
  @Input() label = 'title'
  @Input() selectedStatus!: TaskStatus
  @Output() selectedStatusChanged = new EventEmitter<TaskStatus>()
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;

  statuses: TaskStatusDropdownItem[] = [
    {id: 1, title: 'TODO', value: 'TODO'},
    {id: 2, title: 'IN_PROGRESS', value: 'IN_PROGRESS'},
    {id: 3, title: 'DONE', value: 'DONE'},
  ];

  onChange(event: any) {
    this.form.controls[this.controlName].patchValue(event.value.title)
  }
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskStatusDropdownItem {
  id: number;
  title: TaskStatus;
  value: string;
}