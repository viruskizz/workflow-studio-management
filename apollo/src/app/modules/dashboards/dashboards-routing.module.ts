import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', data: {breadcrumb: 'User Dashboard'}, loadChildren: () => import('./user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule) },
  ])],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
