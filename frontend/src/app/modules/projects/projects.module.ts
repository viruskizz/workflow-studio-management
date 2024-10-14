import { NgModule } from "@angular/core";
import { ProjectsComponent } from './projects.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../../shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ProjectViewComponent } from "./project-view/project-view.component";

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: ':id', component: ProjectViewComponent},
]

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectViewComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,

    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class ProjectsModule { }
