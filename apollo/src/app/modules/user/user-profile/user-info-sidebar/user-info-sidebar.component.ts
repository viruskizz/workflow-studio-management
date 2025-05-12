import { UserService } from 'src/app/services/user.service';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Team } from 'src/app/models/team.model';
import { getDefaultAvatar } from 'src/app/utils';

@Component({
  selector: 'app-user-info-sidebar',
  templateUrl: './user-info-sidebar.component.html'
})
export class UserInfoSidebarComponent implements OnInit {
  @Input({ required: true }) user!: User;
  @Input() authUser: any = null;
  @Input() userTeams: Team[] = [];
  @Input() styleClass = '';
  @Output() editUserEvent = new EventEmitter<void>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (this.user.id) {
      this.userService.getAuthUser(this.user.id!).subscribe((authUser) => {
        console.log('authUser', authUser);
        this.authUser = authUser;
      });
    }
  }

  editUser() {
    this.editUserEvent.emit();
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
