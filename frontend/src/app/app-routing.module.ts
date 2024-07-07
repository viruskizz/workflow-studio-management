import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/root/page-not-found/page-not-found.component';
import { rootRoutes } from './modules/root/root.module';
import { authGuard } from './shared/auth.guard';
import { LoginComponent } from './modules/root/login/login.component';
import { UserLayoutComponent } from './shared/layout/user/user-layout.component';
import { MainLayoutComponent } from './shared/layout/main/main-layout.component';

const routes: Routes = [
  {
    path: 'dashboard',
    // canActivateChild: [authGuard],
    component: UserLayoutComponent,
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'projects', loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'team', loadChildren: () => import('./modules/team/team.module').then(m => m.TeamModule) },
  { path: 'users', loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule) },
  { path: 'settings', loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule) },
  // {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: '',
    component: MainLayoutComponent,
    children: rootRoutes
  },
  {path: '**', component: PageNotFoundComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}