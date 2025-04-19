import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-colleagues',
  templateUrl: './user-colleagues.component.html'
})
export class UserColleaguesComponent {
  @Input() teamMembers: User[] = [];
  @Input() styleClass ='';
}