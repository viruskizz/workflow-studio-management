import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Team } from 'src/app/models/team.model';

@Component({
  selector: 'app-user-info-sidebar',
  templateUrl: './user-info-sidebar.component.html'
})
export class UserInfoSidebarComponent {
  @Input() user: User | null = null;
  @Input() userTeams: Team[] = [];
  @Input() styleClass = '';
  @Output() editUserEvent = new EventEmitter<void>();

  editUser() {
    this.editUserEvent.emit();
  }
}