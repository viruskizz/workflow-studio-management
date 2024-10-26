import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserDetailComponent } from './user-detail.component';
import { UserInputComponent } from './components/input/input.component';
import { WorkMembmerComponent } from './components/member/member.component';
import { StatBoxComponent } from './components/stat-box/stat-box.component';
import { UserTeamComponent } from './components/team/team.component';
import { WorkItemComponent } from './components/work-item/work-item.component';
import { UserInformationComponent } from './user-profile/user-information/user-information.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WorkOnComponent } from './work-on/work-on.component';
import { WorkStatComponent } from './work-stat/work-stat.component';
import { WorkWithComponent } from './work-with/work-with.component';
import { ReactiveFormsModule } from '@angular/forms';

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
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
})
export class UserDetailModule {}
