import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Project } from 'src/app/models/project.model';
import { Task } from 'src/app/models/task.model';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectActions } from 'src/app/store';
import { TaskDetailDialogComponent } from '../../user/shared/task-detail-dialog/task-detail-dialog.component';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
})
export class ProjectViewComponent implements OnInit {

  tasking: Partial<Task> | undefined;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  project?: Project;
  formVisible = false;
  formMode = 'CREATE';
  @ViewChild('taskDetail') taskDetailDialog?: TaskDetailDialogComponent;


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

  onViewTask(task: Partial<Task>) {
    this.formMode = 'EDIT';
    this.tasking = task;
    // this.formVisible = true;
    this.taskDetailDialog?.open(task as Task, this.project, []);
  }

  onCreateTask() {
    this.formMode = 'CREATE';
    this.formVisible = true;
  }

  onAddTask(task: Partial<Task>) {
    this.formMode = 'CREATE';
    this.tasking = task;
    this.formVisible = true;
  }

  onDetailSave(task: Partial<Task>) {

  }
}
