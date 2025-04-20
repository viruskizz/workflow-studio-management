import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { ProjectBreadcrumbResolver } from './project-breadcrumb.resolver';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', data: { breadcrumb: 'Projects' }, component: ProjectComponent },
    { path: ':id', resolve: { breadcrumbs: ProjectBreadcrumbResolver }, component: ProjectViewComponent },
  ])],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
