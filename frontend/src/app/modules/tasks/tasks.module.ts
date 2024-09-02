import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TasksComponent } from "./tasks.component";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: '', component: TasksComponent }
]

@NgModule({
  declarations: [
    TasksComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ]
})
export class TasksModule { }