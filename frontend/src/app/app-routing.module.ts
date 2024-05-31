import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './modules/root/page-not-found/page-not-found.component';
import { rootRoutes } from './modules/root/root.module';
import { profileRoutes } from './modules/main/profile/profile.module';
import { sidebarRoutes } from './modules/sidebar/sidebar.module';
import { authGuard } from './shared/auth.guard';

const routes: Routes = [
  {
    path: 'main',
    // canActivateChild: [authGuard],
    loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)
  },
  ...profileRoutes,
  ...sidebarRoutes,
  ...rootRoutes,
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}