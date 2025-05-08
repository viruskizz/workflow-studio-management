import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAutocompleteComponent } from './components/forms/user-autocomplete/user-autocomplete.component';
import { TestComponent } from './components/test/test.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TaskStatusComponent } from './components/forms/task-status/task-status.component';
import { TeamDropdownComponent } from './components/forms/team-dropdown/team-dropdown.component';
import { TaskTypeComponent } from './components/forms/task-type/task-type.component';
import { IconsModule } from './components/icons/icons.module';
import { TaskDropdownComponent } from './components/forms/task-dropdown/task-dropdown.component';
import { TeamStageComponent } from './components/forms/team-stage/team-stage.component';
import { TeamService } from '../services/team.service';

const sharedComponents: any[] = [
  TestComponent,
  UserAutocompleteComponent,
  TaskStatusComponent,
  TeamDropdownComponent,
  TaskTypeComponent,
  TaskDropdownComponent,
  TeamStageComponent
];

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  declarations: [
    ...sharedComponents
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    InputTextModule,
    AutoCompleteModule,
    AvatarModule,
    DropdownModule,

    IconsModule,
  ],
  providers: [
    TeamService
  ],
  exports: [
    ...sharedComponents,
    IconsModule,
  ]
})
export class SharedModule { }
