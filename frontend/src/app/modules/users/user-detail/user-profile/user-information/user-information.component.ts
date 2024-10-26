import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../../../../models/user.model';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.css',
})
export class UserInformationComponent implements OnChanges {
  @Input() userInformation: User = {} as User;
  @Input() userId = 0;
  avatar = '../assets/images/avatar-default.jpg';
  isDisabled = true;

  constructor(private userService: UserService) {}

  informationForm = new FormGroup({
    email: new FormControl(''),
    'job-title': new FormControl(''),
    phone: new FormControl(''),
    department: new FormControl(''),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userInformation']) {
      this.informationForm.patchValue({
        email: this.userInformation.email,
      });
    }
  }

  setDisabledState(value: boolean) {
    this.isDisabled = value;
  }

  onSubmit() {
    console.log(this.informationForm.value);
    //TODO: When in database change schema to handle job-title, department, phone
    // Send whole object to patch method.
    this.userService
      .patchUser(this.userId, { email: this.informationForm.value.email })
      .subscribe();
    // this.userService
    //   .patchUser(this.userId, informationForm.value)
    //   .subscribe();
  }
}
