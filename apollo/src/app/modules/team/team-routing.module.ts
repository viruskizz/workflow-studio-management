import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeamComponent } from './team.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: TeamComponent },
            { path: ':id', component: TeamDetailComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class TeamRoutingModule {}
