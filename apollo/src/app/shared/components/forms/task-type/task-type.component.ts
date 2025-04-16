import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaskType } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-type',
  templateUrl: './task-type.component.html',
})
export class TaskTypeComponent implements OnChanges {
  @Input() label = 'value'
  @Input() selectedType?: TaskType;
  @Input() ngClass?: string | any[] | object;
  @Output() selectedTypeChange = new EventEmitter<TaskType>()
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;

  types: TaskTypeDropdownItem[] = [
    {id: 1, title: 'Epic', value: 'EPIC', icon: 'assets/icons/jira-issue/epic.png' },
    {id: 2, title: 'Story', value: 'STORY', icon: 'assets/icons/jira-issue/story.png'},
    {id: 3, title: 'Task', value: 'TASK', icon: 'assets/icons/jira-issue/task.png'},
    {id: 4, title: 'subtask', value: 'SUBTASK', icon: 'assets/icons/jira-issue/subtask.png'},
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form'].currentValue) {
      this.selectedType = this.form.controls[this.controlName].value;
    }
  }
  onChange(event: any) {
    // this.selectedType = event;
    this.form.controls[this.controlName].patchValue(event.value.value)
  }

  getItem(type: TaskType) {
    return this.types.find(item => item.value === type);
  }
}

export interface TaskTypeDropdownItem {
  id: number;
  title: string;
  value: TaskType;
  icon: string;
}