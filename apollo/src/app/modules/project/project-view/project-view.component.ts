import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
})
export class ProjectViewComponent implements OnInit {
  
  taskDialog = false;
  task?: Task;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  ngOnInit(): void {
    this.items = [
      { label: 'Table', icon: 'pi pi-home', id: 'table' },
      { label: 'Board', icon: 'pi pi-chart-line', id: 'board' },
    ];
    this.activeItem = this.items[0]
  }

  hideDialog() {
    this.taskDialog = false;
  }
  
  onActivePageChange(menuItem: MenuItem) {
    this.activeItem = menuItem;
  }
}
