import { NgModule } from "@angular/core";
import { TeamComponent } from './team.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: '', component: TeamComponent }
]

@NgModule({
  declarations: [
    TeamComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class TeamModule { }