import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnChanges {
  @Input() user?: User;
  @Output() userChange = new EventEmitter<User>();

  @Output() onCloseEvent = new EventEmitter<User | null>()

  @Input() isShow = false;

  submitted = false;
  isPatch = false;

  userForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    role: new FormControl('', Validators.required),
  })

  roles = [
    { label: 'Member', value: 'MEMBER' },
    { label: 'Moderator', value: 'Moderator' },
    { label: 'Admin', value: 'Admin' },
  ]

  constructor(private userService: UserService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']?.currentValue) {
      this.userForm.patchValue(changes['user'].currentValue);
      this.userForm.patchValue({ password: undefined })
      this.userForm.controls.username.disable()
      this.isPatch = true;
    } else {
      this.isPatch = false;
    }
  }

  onSave() {
    // Mapping only use fields
    const body = {
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      username: this.userForm.value.username,
      // role: this.userForm.value.role,
      // password: this.userForm.value.password,
    };
    this.submitted = true;
    if (this.isPatch && this.user) {
      this.userService.patchUser(this.user.id, body).subscribe(res => {
        console.log(res);
        this.submitted = true;
        this.isShow = false;
        const newUser = this.userForm.value as User;
        this.onCloseEvent.emit(newUser)
      })
    }
  }

  onCancel() {
    this.onCloseEvent.emit(null)
  }

  onHide() {
    this.userChange.emit(undefined);
    this.onCloseEvent.emit(null)
    // Reset Everything
    this.userForm.reset();
    this.submitted = false;
  }
}
