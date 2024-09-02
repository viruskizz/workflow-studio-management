import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from '@angular/common';
import { UsersComponent } from './users.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserViewComponent } from './user-view/user-view.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'view', component: UserViewComponent }
]

@NgModule({
  declarations: [
    UsersComponent,
    UserViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    DatePipe,
    FontAwesomeModule
  ]
})
export class UsersModule { }