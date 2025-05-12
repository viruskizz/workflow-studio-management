import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { UserWorkingOnComponent } from './user-working-on/user-working-on.component';
import { UserTaskStatsComponent } from './user-task-stats/user-task-stats.component';
import { UserWorkingWithComponent } from './user-working-with/user-working-with.component';
import { PanelModule } from 'primeng/panel';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
    PanelModule,
    MessageModule,
    ChipModule,
    TableModule,
    TagModule,
    MenuModule,
    ProgressSpinnerModule,
  ],
  declarations: [
    UserWorkingWithComponent,
    UserWorkingOnComponent,
    UserTaskStatsComponent
  ],
  exports: [
    UserWorkingWithComponent,
    UserWorkingOnComponent,
    UserTaskStatsComponent,
    
    CardModule,
    ButtonModule,
    AvatarModule
  ]
})
export class UserSharedModule { }
