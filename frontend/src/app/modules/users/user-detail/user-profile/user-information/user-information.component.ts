import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../../../../models/user.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.css',
})
export class UserInformationComponent implements OnChanges{
  @Input() userInformation: User = {} as User;

  informationForm = new FormGroup({
      email: new FormControl(''),
      'job-title': new FormControl(''),
      phone: new FormControl(''),
      department: new FormControl(''),
    });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userInformation']) {
      this.informationForm = new FormGroup({
        email: new FormControl(this.userInformation.email),
        'job-title': new FormControl(''),
        phone: new FormControl(''),
        department: new FormControl(''),
      });
    }
  }

  avatar = '../assets/images/avatar-default.jpg';

  isDisabled = true;

  setDisabledState(value: boolean) {
    this.isDisabled = value;
  }

  onSubmit() {
    console.log(this.informationForm.value)
  }
}
