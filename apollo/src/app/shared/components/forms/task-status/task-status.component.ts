import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup} from '@angular/forms';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
})
export class TaskStatusComponent implements OnChanges {
  @Input() label = 'value'
  @Input() selectedStatus?: TaskStatus;
  @Output() selectedStatusChanged = new EventEmitter<TaskStatus>()
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input() ngClass?: string | any[] | object;

  statuses: TaskStatusDropdownItem[] = [
    {id: 3, title: 'BACKLOG', value: 'DONE', icon: 'pi pi-circle-on'},
    {id: 1, title: 'Todo', value: 'TODO', icon: 'pi pi-circle'},
    {id: 2, title: 'In Progress', value: 'IN_PROGRESS', icon: 'pi pi-spinner'},
    {id: 3, title: 'Done', value: 'DONE', icon: 'pi pi-check-circle'},
    {id: 3, title: 'CANCELLED', value: 'DONE', icon: 'pi pi-times-circle'},
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form'].currentValue) {
      this.selectedStatus = this.form.controls[this.controlName].value;
    }
  }

  onChange(event: any) {
    this.form.controls[this.controlName].patchValue(event.value.title)
  }

  getItem(type: TaskStatus) {
    return this.statuses.find(item => item.value === type);
  }
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskStatusDropdownItem {
  id: number;
  title: string;
  value: TaskStatus;
  icon: string;
}