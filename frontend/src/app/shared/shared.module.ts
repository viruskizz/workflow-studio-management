import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './layout/main/main-layout.component';
import { UserLayoutComponent } from './layout/user/user-layout.component';  
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TablePanelComponent } from './components/table-panel/table-panel.component';


const sharedComponent: any[] = [
  HeaderComponent,
  SidebarComponent,
  DynamicTableComponent,
  TableHeaderComponent
];

const layoutComponent: any[] = [
  MainLayoutComponent,
  UserLayoutComponent,
];

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  declarations: [
    ...sharedComponent,
    ...layoutComponent,
    TablePanelComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
  ],
  exports: [
    ...sharedComponent,
    ...layoutComponent,
    FontAwesomeModule,
  ]
})
export class SharedModule { }
