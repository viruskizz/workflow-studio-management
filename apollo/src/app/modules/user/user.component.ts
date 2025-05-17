import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/user.model';

@Component({
  templateUrl: './user.component.html',
  providers: [MessageService]
})
export class UserComponent {
  // Table config

  // Data config
  user?: User;
  userDialog = false;
  authDialog = false;

  constructor(
    private messageService: MessageService,
  ) { }

  createUser() {
    this.user = undefined;
    this.userDialog = true;
  }

  createAuth() {
    this.authDialog = true;
  }

  hideDialog(event?: User) {
    console.log('hideDialog', event);
    this.userDialog = false;
    if (event) {
      // Created user
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `User ${event.username} created`,
        life: 3000
      });
    }
    this.user = undefined;
  }
}
