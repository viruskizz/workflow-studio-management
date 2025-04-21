import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html'
})
export class UserStatsComponent {
  @Input() taskStats = {
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0
  };
}