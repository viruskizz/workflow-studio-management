import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserDetailManageComponent } from './user-detail-manage/user-detail-manage.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: UserComponent },
            { path: ':id', component: UserDetailComponent },
            { path: ':id/edit', component: UserDetailManageComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class UserRoutingModule {}
