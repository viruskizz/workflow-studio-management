import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-task-stats',
  templateUrl: './user-task-stats.component.html'
})
export class UserTaskStatsComponent {
  @Input() taskStats = {
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0
  };
}