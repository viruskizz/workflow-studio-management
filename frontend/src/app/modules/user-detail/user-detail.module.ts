import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailComponent } from './user-detail.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserInformationComponent } from './user-profile/user-information/user-information.component';
import { UserInputComponent } from './components/input/input.component';
import { UserTeamComponent } from './components/team/team.component';
import { WorkStatComponent } from './work-stat/work-stat.component';
import { StatBoxComponent } from './components/stat-box/stat-box.component';
import { WorkItemComponent } from './components/work-item/work-item.component';
import { WorkOnComponent } from './work-on/work-on.component';
import { WorkWithComponent } from './work-with/work-with.component';
import { WorkMembmerComponent } from './components/member/member.component';

export const userDetailRoutes: Routes = [
  { path: '', component: UserDetailComponent },
];

@NgModule({
  declarations: [
    UserDetailComponent,
    UserProfileComponent,
    UserInformationComponent,
    UserInputComponent,
    UserTeamComponent,
    WorkStatComponent,
    StatBoxComponent,
    WorkItemComponent,
    WorkOnComponent,
    WorkWithComponent,
    WorkMembmerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(userDetailRoutes),
    MatButtonModule,
    MatIconModule,
  ],
})
export class UserDetailModule {}
