import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TeamComponent } from './team.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamRoutingModule } from './team-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TeamRoutingModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    AvatarModule,
    FileUploadModule,
    TooltipModule,
    SharedModule,
  ],
  declarations: [TeamComponent, TeamFormComponent]
})
export class TeamModule { }

