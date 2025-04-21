import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html'
})
export class UserActivityComponent {
  @Input() styleClass = '';
}