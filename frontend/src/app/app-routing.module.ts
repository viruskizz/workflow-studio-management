import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
  {path: '', loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)},
  // {path: '**', component}
]
@NgModule({
  imports: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
