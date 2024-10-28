import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TasksComponent } from "./tasks.component";
import { SharedModule } from "../../shared/shared.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import {MatDatepickerModule} from '@angular/material/datepicker';

const routes: Routes = [
  { path: '', component: TasksComponent },
  { path: 'create', component: TaskCreateComponent },
  { path: ':id', component: TaskViewComponent },
]

@NgModule({
  declarations: [
    TasksComponent,
    TaskCreateComponent,
    TaskViewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    DatePipe,
    FontAwesomeModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ]
})
export class TasksModule { }