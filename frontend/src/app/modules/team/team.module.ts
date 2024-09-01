import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TdLeaderIconComponent } from './components/td-leader-icon/td-leader-icon.component';
import { TdNameRowComponent } from "./components/td-name/td-name.component";
import { TdMembersComponent } from './components/td-members/td-members.component';

const tableComponent : any[] = [
  TdNameRowComponent,
  TdLeaderIconComponent,
    TdMembersComponent,
]

const routes: Routes = [
  { path: '', component: TeamComponent }
]

@NgModule({
  declarations: [
    TeamComponent,
    ...tableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ]
})
export class TeamModule { }