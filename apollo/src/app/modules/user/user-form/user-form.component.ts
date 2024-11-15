import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  @Input() user?: User;

  @Output() onCloseEvent = new EventEmitter<User | null>()

  @Input() isShow = false;

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

  constructor() { }

  OnChanges(changes: SimpleChanges) {
    console.log('user:', changes['user'].currentValue)
  }

  onSave() {
    const newUser: User = {
      id: 0,
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      createdAt: '',
      updatedAt: ''
    }
    this.onCloseEvent.emit(newUser)
  }

  onCancel() {
    this.onCloseEvent.emit(null)
  }

  onHide() {
    this.onCloseEvent.emit(null)
  }
}
