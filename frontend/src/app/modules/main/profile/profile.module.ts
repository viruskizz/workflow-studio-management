import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
    { path: 'profile', component: ProfileComponent}
]

@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        CommonModule
    ]
})

export class ProfileModule {}