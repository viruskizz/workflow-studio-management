import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
})
export class UserTeamComponent {
  @Input() teamIcon = '../assets/images/avatar-default.jpg';
  @Input() teamName = 'Team\'s name';
  @Input() memberAmount = "5";
}
