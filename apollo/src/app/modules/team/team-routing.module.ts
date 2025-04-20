import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeamComponent } from './team.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamDetailStageComponent } from './team-detail/team-detail-stage/team-detail-stage.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: TeamComponent },
      { path: ':id', component: TeamDetailComponent },
      { path: ':id/stage', component: TeamDetailStageComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class TeamRoutingModule { }
