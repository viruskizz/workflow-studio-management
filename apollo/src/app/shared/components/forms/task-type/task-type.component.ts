import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaskType } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-type',
  templateUrl: './task-type.component.html',
})
export class TaskTypeComponent {
  @Input() label = 'value'
  @Input() selectedType?: TaskTypeDropdownItem
  @Input() ngClass?: string | any[] | object;
  @Output() selectedTypeChange = new EventEmitter<TaskTypeDropdownItem>()
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;

  types: TaskTypeDropdownItem[] = [
    {id: 1, title: 'Epic', value: 'EPIC', icon: 'assets/icons/jira-issue/epic.png' },
    {id: 2, title: 'Story', value: 'STORY', icon: 'assets/icons/jira-issue/story.png'},
    {id: 3, title: 'Task', value: 'TASK', icon: 'assets/icons/jira-issue/task.png'},
    {id: 4, title: 'subtask', value: 'SUBTASK', icon: 'assets/icons/jira-issue/subtask.png'},
  ];

  onChange(event: any) {
    // this.selectedType = event;
    this.form.controls[this.controlName].patchValue(event.value)
  }
}

export interface TaskTypeDropdownItem {
  id: number;
  title: string;
  value: TaskType;
  icon: string;
}