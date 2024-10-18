import { Component } from '@angular/core';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.css',
})
export class UserInformationComponent {
  avatar =
    '../assets/images/avatar-default.jpg';

  user = {
    name: 'John Doe',
  };

  isDisabled = true;

  setDisabledState(value: boolean) {
    this.isDisabled = value;
  }
}
