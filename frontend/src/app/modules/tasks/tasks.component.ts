import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../models/user.model';
import { PeriodicElement } from '../users/users.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-taks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  displayedColumns: string[] = ['id', 'avatar', 'username', 'firstname', 'lastname', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  clickedRows = new Set<PeriodicElement>();
  searchKeywordFilter = new FormControl();

  @ViewChild(MatSort) sort!: MatSort;
  constructor(private userService: UserService) {}

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
}