import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodicElement } from '../users/users.component';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-taks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  displayedColumns: string[] = ['id', 'summary', 'type', 'status', 'project', 'assignee'];
  dataSource = new MatTableDataSource<Task>([]);
  clickedRows = new Set<PeriodicElement>();
  searchKeywordFilter = new FormControl();

  @ViewChild(MatSort) sort!: MatSort;
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.list().subscribe((tasks) => {
      this.dataSource.sort = this.sort;
      this.dataSource.data = tasks;
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