import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAutocompleteComponent } from './components/user-autocomplete/user-autocomplete.component';
import { TestComponent } from './components/test/test.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';

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

    InputTextModule,
    AutoCompleteModule,
  ],
  exports: [
    ...sharedComponents,
  ]
})
export class SharedModule { }
