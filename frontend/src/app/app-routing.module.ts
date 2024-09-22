import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/root/page-not-found/page-not-found.component';
import { rootRoutes } from './modules/root/root.module';
import { UserLayoutComponent } from './shared/layout/user/user-layout.component';
import { MainLayoutComponent } from './shared/layout/main/main-layout.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: UserLayoutComponent,
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'projects', component: UserLayoutComponent, loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'tasks', component: UserLayoutComponent, loadChildren: () => import('./modules/tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'users', component: UserLayoutComponent, loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule) },
  { path: 'team', component: UserLayoutComponent, loadChildren: () => import('./modules/team/team.module').then(m => m.TeamModule) },
  { path: 'settings', component: UserLayoutComponent, loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule) },
  { path: 'user-detail', component: UserLayoutComponent, loadChildren: () => import('./modules/user-detail/user-detail.module').then(m => m.UserDetailModule) },
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
