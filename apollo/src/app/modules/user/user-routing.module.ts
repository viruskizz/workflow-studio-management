import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserBreadcrumbResolver } from './user-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', data: { breadcrumb: 'Users' }, component: UserComponent },
      { path: ':id', resolve: { breadcrumbs: UserBreadcrumbResolver }, component: UserProfileComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class UserRoutingModule {}
