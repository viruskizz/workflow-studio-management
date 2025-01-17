import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectViewComponent } from './project-view/project-view.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProjectComponent },
		{ path: ':id', component: ProjectViewComponent },
	])],
	exports: [RouterModule]
})
export class ProjectRoutingModule { }
