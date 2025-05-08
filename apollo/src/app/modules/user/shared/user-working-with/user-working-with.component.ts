import { Component, Input } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { getDefaultAvatar } from 'src/app/utils';

@Component({
  selector: 'app-user-working-with',
  templateUrl: './user-working-with.component.html'
})
export class UserWorkingWithComponent {
  @Input() teams: Team[] = [];
  @Input() styleClass = '';

  onImageError(teamIndex: number, memberIndex: number) {
    if (this.teams[teamIndex]?.members?.[memberIndex]) {
      this.teams[teamIndex].members[memberIndex].imageUrl = getDefaultAvatar();
    }
  }
  
  getImage(url: string) {
    return url || 'assets/images/noimage.jpg';
  }
}
