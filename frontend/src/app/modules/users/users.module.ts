import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from '@angular/common';
import { UsersComponent } from './users.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { UserDetailComponent } from "./user-detail/user-detail.component";

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: ':userId', component: UserDetailComponent }
]

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    DatePipe,
    FontAwesomeModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ]
})
export class UsersModule { }
