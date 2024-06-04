import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ProjectsComponent }
]

@NgModule({
  declarations: [
    ProjectsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ]
})
export class ProjectsModule { }