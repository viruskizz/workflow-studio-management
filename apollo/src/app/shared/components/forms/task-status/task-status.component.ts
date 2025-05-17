import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaskStatus } from 'src/app/models/task.model';
import { AppStyleUtil } from 'src/app/utils/app-style.util';


interface TaskStatusDropdownItem {
  id: number;
  value: TaskStatus;
}

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
})
export class TaskStatusComponent implements OnChanges {
  @Input() label = 'value'
  @Input() selectedStatus?: TaskStatusDropdownItem;
  @Output() statusChange = new EventEmitter<TaskStatus>();  // Rename to match template
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input() ngClass?: string | any[] | object;

  statuses: TaskStatusDropdownItem[] = [
    { id: 4, value: 'BACKLOG' },
    { id: 1, value: 'TODO' },
    { id: 2, value: 'IN_PROGRESS' },
    { id: 3, value: 'DONE' },
    { id: 5, value: 'CANCELLED' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']?.currentValue) {
      const value = this.form.controls[this.controlName].value;
      this.selectedStatus = this.statuses.find(s => s.value === value);
    }
  }

  onChange(event: any) {
    const newStatus = event.value.value;
    this.form.controls[this.controlName].patchValue(newStatus);
    this.statusChange.emit(newStatus);  // Emit the TaskStatus value
  }

  getItem(type: TaskStatus) {
    return AppStyleUtil.getTaskStatusIcon(type);
  }
}
