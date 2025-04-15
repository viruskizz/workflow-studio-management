import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-type',
  templateUrl: './task-type.component.html',
})
export class TaskTypeComponent {
  @Input() label = 'type'
  @Input() selectedType!: TaskType
  @Output() selectedTypeChanged = new EventEmitter<TaskType>()
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;

  types: TaskTypeDropdownItem[] = [
    {id: 1, title: 'Epic', value: 'EPIC', icon: 'assets/icons/jira-issue/epic.png' },
    {id: 2, title: 'Story', value: 'STORY', icon: 'assets/icons/jira-issue/story.png'},
    {id: 3, title: 'Task', value: 'TASK', icon: 'assets/icons/jira-issue/task.png'},
    {id: 4, title: 'subtask', value: 'SUB_TASK', icon: 'assets/icons/jira-issue/subtask.png'},
  ];

  onChange(event: any) {
    this.form.controls[this.controlName].patchValue(event.value.title)
  }
}

export type TaskType = 'EPIC' | 'STORY' | 'TASK' | 'SUB_TASK';

export interface TaskTypeDropdownItem {
  id: number;
  title: string;
  value: TaskType;
  icon: string;
}