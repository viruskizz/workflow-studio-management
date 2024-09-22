import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailComponent } from './user-detail.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserInformationComponent } from './user-information/user-information.component';
import { RouterModule, Routes } from '@angular/router';

export const userDetailRoutes: Routes = [
  { path: '', component: UserDetailComponent },
];

@NgModule({
  declarations: [
    UserDetailComponent,
    UserProfileComponent,
    UserInformationComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(userDetailRoutes)],
})
export class UserDetailModule {}
