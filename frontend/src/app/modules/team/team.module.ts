import { NgModule } from '@angular/core';
import { TeamComponent } from './team.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TeamTdComponent } from './components/team-td/team-td.component';
import { MemberIconComponent } from './components/member-icon/member-icon.component';

const routes: Routes = [{ path: '', component: TeamComponent }];

@NgModule({
  declarations: [TeamComponent, TeamTdComponent, MemberIconComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
})
export class TeamModule {}
