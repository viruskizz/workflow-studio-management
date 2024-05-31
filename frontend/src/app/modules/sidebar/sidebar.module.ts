import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { SettingsComponent } from './settings/settings.component';
import { TeamComponent } from './team/team.component';
import { UserComponent } from './user/user.component';

export const sidebarRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'team', component: TeamComponent },
    { path: 'user', component: UserComponent },
    { path: 'settings', component: SettingsComponent }
];

@NgModule({
    declarations: [
        DashboardComponent,
        ProjectsComponent,
        TeamComponent,
        UserComponent,
        SettingsComponent
    ],
    imports: [RouterModule.forChild(sidebarRoutes)],
    exports: [RouterModule]
})

export class SidebarRoutingModule { }