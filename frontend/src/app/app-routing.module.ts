import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/root/page-not-found/page-not-found.component';
import { rootRoutes } from './modules/root/root.module';
import { DashboardLayoutComponent } from './shared/layouts/dashboard/dashboard-layout.component';
import { MainLayoutComponent } from './shared/layouts/main/main-layout.component';

const routes: Routes = [
  {
    path: 'dashboard',
    // component: UserLayoutComponent,
    component: DashboardLayoutComponent,
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'projects', component: DashboardLayoutComponent, loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'tasks', component: DashboardLayoutComponent, loadChildren: () => import('./modules/tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'users', component: DashboardLayoutComponent, loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule) },
  { path: 'team', component: DashboardLayoutComponent, loadChildren: () => import('./modules/team/team.module').then(m => m.TeamModule) },
  { path: 'settings', component: DashboardLayoutComponent, loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule) },
  {
    path: '',
    component: MainLayoutComponent,
    children: rootRoutes
  },
  { path: '**', component: PageNotFoundComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }