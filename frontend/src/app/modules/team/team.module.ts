import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: TeamComponent }
]

@NgModule({
  declarations: [
    TeamComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ]
})
export class TeamModule { }