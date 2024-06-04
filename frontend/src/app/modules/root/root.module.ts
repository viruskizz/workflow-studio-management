import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';

export const rootRoutes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'profile', component: ProfileComponent}
]

@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    PageNotFoundComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class RootModule { }
