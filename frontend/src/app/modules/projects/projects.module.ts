import { NgModule } from "@angular/core";
import { ProjectsComponent } from './projects.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateProjectComponent } from "./create-project/create-project.component";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: '', component: ProjectsComponent }
]

@NgModule({
  declarations: [
    ProjectsComponent,
    CreateProjectComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class ProjectsModule { }