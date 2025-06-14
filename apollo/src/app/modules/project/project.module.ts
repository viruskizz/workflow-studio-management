import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
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
import { ProjectComponent } from './project.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { EditorModule } from 'primeng/editor';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { ProjectTaskFormComponent } from './project-view/project-task-form/project-task-form.component';
import { CalendarModule } from 'primeng/calendar';
import { ProjectTreeTableViewComponent } from './project-view/project-tree-table-view/project-tree-table-view.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { SidebarModule } from 'primeng/sidebar';
import { InplaceModule } from 'primeng/inplace';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { UserSharedModule } from '../user/shared/user-shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ProjectRoutingModule,
    ReactiveFormsModule,
    UserSharedModule,

    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
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
    AutoCompleteModule,
    ChipModule,
    ImageModule,
    TreeModule,
    TreeTableModule,
    EditorModule,
    TabMenuModule,
    CalendarModule,
    SidebarModule,
    InplaceModule,
    OverlayPanelModule,
    MessagesModule,
  ],
  declarations: [
    ProjectComponent,
    ProjectFormComponent,
    ProjectViewComponent,
    ProjectTaskFormComponent,
    ProjectTreeTableViewComponent,
  ],
  providers: [
    MessageService
  ]
})
export class ProjectModule { }
