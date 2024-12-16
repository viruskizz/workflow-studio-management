import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAutocompleteComponent } from './components/user-autocomplete/user-autocomplete.component';
import { TestComponent } from './components/test/test.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const sharedComponents: any[] = [
  UserAutocompleteComponent,
  TestComponent,
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
  ],
  exports: [
    ...sharedComponents,
  ]
})
export class SharedModule { }
