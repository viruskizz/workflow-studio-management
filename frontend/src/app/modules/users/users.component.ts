import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { faChevronLeft, faChevronRight, faCoffee, faPenToSquare, faTrash, faEye, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  faCoffee = faCoffee;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faEye = faEye;
  faMagnifyingGlass = faMagnifyingGlass;

  isShowModal = false;

  users: User[] = [];
  filteredUsers: User[] = [];
  sortColumns: keyof User = 'username';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  userPerPage = 10;

  constructor(private userService: UserService, libray: FaIconLibrary) {
    libray.addIcons(faCoffee);
    libray.addIcons(faPenToSquare);
    libray.addIcons(faTrash);
    libray.addIcons(faChevronLeft);
    libray.addIcons(faChevronRight);
  }

  ngOnInit(): void {
    this.userService.listUser().subscribe((users) => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  paginatedUsers() { }

  pageChange() { }

  filteredUser(searchInput: Event) {
    const inputElement = searchInput.target as HTMLInputElement;
    const searchTerm = inputElement.value.toLowerCase();

    if (searchTerm) {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredUsers = this.users;
    }
  }

  sortByColumn(column: keyof User) {
    if (this.sortColumns === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumns = column;
      this.sortDirection = 'asc';
    }
    this.sortedUsers();
  }

  sortedUsers() {
    this.filteredUsers.sort((a, b) => {
      const keyA = a[this.sortColumns];
      const keyB = b[this.sortColumns];

      if (keyA === undefined || keyB === undefined) {
        return 0;
      }

      if (keyA < keyB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (keyA > keyB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  addUser() { }

  editUser(userId: number | string): void {
    console.log('Edit user with ID:', userId);
  }

  deleteUser(userId: number | string): void {
    console.log('Delete user with ID:', userId);
  }
}
