import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Team } from 'src/app/models/team.model';
import { getDefaultAvatar } from 'src/app/utils';

@Component({
  selector: 'app-user-info-sidebar',
  templateUrl: './user-info-sidebar.component.html'
})
export class UserInfoSidebarComponent {
  @Input({ required: true }) user!: User;
  @Input({ required: true }) fdnetUsername?: string;
  @Input() userTeams: Team[] = [];
  @Input() styleClass = '';
  @Output() editUserEvent = new EventEmitter<void>();
  @Output() linkAuthEvent = new EventEmitter<void>();

  editUser() {
    this.editUserEvent.emit();
  }

  linkAuth() {
    this.linkAuthEvent.emit();
  }

  getImage(url: string | undefined) {
    return url || 'assets/images/noimage.jpg';
  }

  onUserImageError() {
    if (this.user) {
      this.user.imageUrl = getDefaultAvatar();
    }
  }

  onTeamImageError(teamIndex: number) {
    if (this.userTeams[teamIndex]) {
      this.userTeams[teamIndex].imageUrl = 'assets/images/noimage.jpg';
    }
  }
}
