import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Task, TaskType } from 'src/app/models/task.model';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-dropdown',
  templateUrl: './task-dropdown.component.html',
})
export class TaskDropdownComponent implements OnInit {
  @Input() label = 'id'
  @Input() selectedTask?: Task;
  @Input() ngClass?: string | any[] | object;
  @Output() selectedTaskChange = new EventEmitter<number>()
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input({ required: true }) projectId!: number;

  loading?: boolean;
  tasks: Task[] = [];

  constructor(private projectService: ProjectService, private taskService: TaskService) { }

  ngOnInit() {
    this.loading = true;
    const selectedId = this.form.controls[this.controlName].value;
    this.projectService.listTasks(this.projectId).subscribe({
      next: (v) => {
        this.tasks = v;
      }
    })
    if (selectedId) {
      this.taskService.get(selectedId).subscribe({
        next: (v: any) => {
          this.selectedTask = v;
          this.loading = false;
        }
      });
    }
  }

  onChange(event: any) {
    this.selectedTask = event.value;
    this.form.controls[this.controlName].patchValue(event.value.id)
  }

  getTypeIcon(type?: TaskType) {
    if (!type) { return '' }
    const icons = {
      'EPIC': 'assets/icons/jira-issue/epic.png',
      'STORY': 'assets/icons/jira-issue/story.png',
      'TASK': 'assets/icons/jira-issue/task.png',
      'SUBTASK': 'assets/icons/jira-issue/subtask.png',
    }
    return icons[type];
  }
}
