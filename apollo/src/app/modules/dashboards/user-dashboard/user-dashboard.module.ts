import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserSharedModule } from '../../../modules/user/shared/user-shared.module';

import { UserDashboardComponent } from './user-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    ProgressSpinnerModule,
    
    UserSharedModule
  ],
  declarations: [
    UserDashboardComponent
  ]
})
export class UserDashboardModule { }
