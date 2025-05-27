import { Store } from '@ngrx/store';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Project } from 'src/app/models/project.model';
import { Task } from 'src/app/models/task.model';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectActions } from 'src/app/store';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
})
export class ProjectViewComponent implements OnInit {

  tasking: Partial<Task> | undefined;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  project?: Project;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.items = [
      { label: 'Table', icon: 'pi pi-home', id: 'table' },
      { label: 'Board', icon: 'pi pi-chart-line', id: 'board' },
    ];
    this.activeItem = this.items[0];

    const params = this.route.snapshot.params;
    const projectId = +params['id'];
    this.projectService.getProject(projectId).subscribe((v) => {
      this.project = v;
    });
    this.store.dispatch(ProjectActions.setId({ projectId }));
  }

  onActivePageChange(menuItem: MenuItem) {
    this.activeItem = menuItem;
  }
}
