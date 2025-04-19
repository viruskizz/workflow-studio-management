import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserStatsComponent } from 'src/app/modules/user/shared/user-stats/user-stats.component';
import { UserActivityComponent } from 'src/app/modules/user/shared/user-activity/user-activity.component';
import { UserColleaguesComponent } from 'src/app/modules/user/shared/user-colleagues/user-colleagues.component';

@NgModule({
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    CardModule,
    ButtonModule,
    AvatarModule,
    ProgressSpinnerModule
  ],
  declarations: [
    UserDashboardComponent,
    UserStatsComponent,
    UserActivityComponent,
    UserColleaguesComponent
  ]
})
export class UserDashboardModule { }
