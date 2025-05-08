import { Component, Input } from '@angular/core';
import { Team } from 'src/app/models/team.model';

@Component({
  selector: 'app-user-working-with',
  templateUrl: './user-working-with.component.html'
})
export class UserWorkingWithComponent {
  @Input() teams: Team[] = [];
  @Input() styleClass = '';
}