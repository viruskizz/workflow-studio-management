import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { getDefaultAvatar } from 'src/app/utils';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit, OnChanges {
  @Input() forceReload = false;
  @Output() forceReloadChange = new EventEmitter<boolean>();
  // Table config
  cols: { field: string; header: string }[] = [
    { field: 'id', header: 'ID' },
    { field: 'username', header: 'Username' },
    { field: 'role', header: 'Role' },
  ];
  statuses: { label: string; value: string }[] = [
    { label: 'MEMBER', value: 'member' },
    { label: 'MODERATOR', value: 'moderator' },
    { label: 'ADMIN', value: 'admin' },
  ];
  rowsPerPageOptions = [5, 10, 20];

  // Data config
  users: User[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.listUser().subscribe({
      next: (v) => {
        this.users = v;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['forceReload']?.currentValue) {
      this.userService.listUser().subscribe({
        next: (v) => {
          this.users = v;
          this.forceReload = false;
          this.forceReloadChange.emit(this.forceReload);
        }
      })
    }
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
