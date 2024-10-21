import { Component, Input } from '@angular/core';
import { User } from '../../../../../models/user.model';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.css',
})
export class UserInformationComponent {
  @Input() userInformation: User = {} as User;

  avatar =
    '../assets/images/avatar-default.jpg';

  isDisabled = true;

  setDisabledState(value: boolean) {
    this.isDisabled = value;
  }
}
