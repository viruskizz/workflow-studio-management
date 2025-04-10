import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAutocompleteComponent } from './components/user-autocomplete/user-autocomplete.component';
import { TestComponent } from './components/test/test.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TaskStatusComponent } from './components/task-status/task-status.component';
import { TeamDropdownComponent } from './components/team-dropdown/team-dropdown.component';

const sharedComponents: any[] = [
  UserAutocompleteComponent,
  TestComponent,
  TaskStatusComponent,
  TeamDropdownComponent,
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
    DropdownModule
  ],
  exports: [
    ...sharedComponents,
  ]
})
export class SharedModule { }
