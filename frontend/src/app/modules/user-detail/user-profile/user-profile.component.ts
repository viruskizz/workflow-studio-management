import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  avatar =
    '../assets/images/avatar-default.jpg';

  user = {
    name: 'John Doe',
  };
}
