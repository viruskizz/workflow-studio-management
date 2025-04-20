import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeamComponent } from './team.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamDetailStageComponent } from './team-detail/team-detail-stage/team-detail-stage.component';
import { TeamBreadcrumbResolver } from './team-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', data: { breadcrumb: 'Teams' }, component: TeamComponent },
      { path: ':id', resolve: { breadcrumbs: TeamBreadcrumbResolver }, component: TeamDetailComponent, },
      { path: ':id/stage', resolve: { breadcrumbs: TeamBreadcrumbResolver }, component: TeamDetailStageComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class TeamRoutingModule { }
