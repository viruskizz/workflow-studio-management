import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './modules/root/page-not-found/page-not-found.component';
import { rootRoutes } from './modules/root/root.module';

const routes: Routes = [
  {path: 'main', loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)},
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  ...rootRoutes,
  {path: '**', component: PageNotFoundComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
