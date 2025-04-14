import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { getDefaultAvatar } from 'src/app/utils';
import { Router } from '@angular/router';

@Component({
  templateUrl: './user.component.html',
  providers: [MessageService, ConfirmationService]
})
export class UserComponent implements OnInit {
  // Table config
  cols: { field: string; header: string }[] = [];
  statuses: { label: string; value: string }[] = [];
  rowsPerPageOptions = [5, 10, 20];

  // Data config
  users: User[] = [];
  user?: User;
  userDialog = false;
  deleteUserDialog = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.listUser().subscribe({
      next: (v) => {
        this.users = v;
        console.log(v);
      }
    })

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'username', header: 'Username' },
      { field: 'role', header: 'Role' },
    ];

    this.statuses = [
      { label: 'MEMBER', value: 'member' },
      { label: 'MODERATOR', value: 'moderator' },
      { label: 'ADMIN', value: 'admin' },
    ];
  }

  editUser(user: User) {
    this.user = { ...user };
    console.log('Edit:', user);
    this.userDialog = true;
  }

  createUser() {
    this.user = undefined;
    this.userDialog = true;
  }

  // deleteUser(user: User) {
  //   this.deleteUserDialog = true;
  //   this.user = { ...user };
  // }

  // confirmDelete() {
  //   if (!this.user) {
  //     this.deleteUserDialog = false
  //     return;
  //   }
  //   this.userService.deleteUser(this.user!.id!).subscribe({
  //     next: () => {
  //       this.users = this.users.filter(u => u.id !== this.user!.id);
  //       this.deleteUserDialog = false;
  //       this.user = undefined;
  //       this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
  //     }
  //   })

  // }

  hideDialog(event: User | null) {
    this.userDialog = false;
    if (event && this.user?.id) {
      // Edited 
      this.users[this.users.findIndex(u => u.id === this.user!.id)] = event;
    } else if (event) {
      // Created user
      this.users.push(event);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
    }
    this.user = undefined;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onImageError(idx: number) {
    this.users[idx].imageUrl = getDefaultAvatar()
  }

  navigateToUserProfile(user: User) {
    if (user && user.id) {
      this.router.navigate(['/users', user.id]);
    }
  }
}
