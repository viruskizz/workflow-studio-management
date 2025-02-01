import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: UserComponent },
            { path: ':id', component: UserProfileComponent }, // Add this route
        ]),
    ],
    exports: [RouterModule],
})
export class UserRoutingModule {}
