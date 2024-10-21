import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'avatar', 'username', 'firstname', 'lastname', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  clickedRows = new Set<PeriodicElement>();
  searchKeywordFilter = new FormControl();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private router: Router) {

  }

  ngOnInit(): void {
    this.userService.listUser().subscribe((users) => {
      this.dataSource.sort = this.sort;
      this.dataSource.data = users;
    });
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value
    const tableFilters = [];
    tableFilters.push({
      id: 'name',
      value: filterValue
    });
    // this.dataSource.filter = JSON.stringify(tableFilters);
    this.dataSource.filter = filterValue.toLowerCase()
  }

  viewUser(user: User) {
    this.router.navigate(['users', user.id])
    return user;
  }

  editUser(user: User) {
    return user;
  }

  deleteUser(user: User) {
    return user;
  }
}
