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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { TaskDetailDialogComponent } from './task-detail-dialog/task-detail-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChipsModule } from 'primeng/chips';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
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
    DialogModule,
    ProgressBarModule,
    ChipsModule,
    SelectButtonModule,
    CalendarModule,

    ProgressSpinnerModule,
    SharedModule,
  ],
  declarations: [
    UserWorkingWithComponent,
    UserWorkingOnComponent,
    UserTaskStatsComponent,
    TaskDetailDialogComponent
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
