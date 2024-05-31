import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';

export const profileRoutes: Routes = [
    { path: 'profile', component: ProfileComponent}
]

@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(profileRoutes),
    ]
})

export class ProfileModule {}