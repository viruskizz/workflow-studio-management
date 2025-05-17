import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FieldsetModule } from 'primeng/fieldset';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';

// App modules
import { UserRoutingModule } from './user-routing.module';
import { UserSharedModule } from './shared/user-shared.module';

// Components
import { UserComponent } from './user.component';
import { UserFormComponent } from './shared/user-form/user-form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserInfoSidebarComponent } from './user-profile/user-info-sidebar/user-info-sidebar.component';
import { UserAuthFormComponent } from './shared/user-auth-form/user-auth-form.component';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    
    UserSharedModule,

    TableModule,
    FileUploadModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    FieldsetModule,
    ImageModule,
    TagModule,
    ProgressSpinnerModule
  ],
  declarations: [
    UserComponent,
    UserProfileComponent,
    UserInfoSidebarComponent,
    UserListComponent,
  ]
})
export class UserModule { }
