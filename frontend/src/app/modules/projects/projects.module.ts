import { NgModule } from "@angular/core";
import { ProjectsComponent } from './projects.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../../shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ProjectViewComponent } from "./project-view/project-view.component";
import { ProjectCreateDialogComponent } from './project-create-dialog/project-create-dialog.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from '@angular/material/card'
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { CommonModule } from "@angular/common";
const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: 'create', component: ProjectCreateDialogComponent },
  { path: ':id', component: ProjectViewComponent},
]

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectViewComponent,
    ProjectCreateDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule,
    ReactiveFormsModule,

    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatAutocompleteModule
  ]
})
export class ProjectsModule { }
