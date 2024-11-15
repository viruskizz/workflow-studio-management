import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  @Input() user?: User;

  @Output() onCloseEvent = new EventEmitter<User | null>()

  @Input() isShow = false;

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
    this.isShow = false;
    this.onCloseEvent.emit(newUser)
  }

  onCancel() {
    this.isShow = false;
    this.onCloseEvent.emit(null)
  }
}
