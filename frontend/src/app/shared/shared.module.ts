import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './layout/main/main-layout.component';
import { MemberLayoutComponent } from './layout/member/member-layout.component';

const sharedComponent: any[] = [
  HeaderComponent,
  SidebarComponent
];

const layoutComponent: any[] = [
  MainLayoutComponent,
  MemberLayoutComponent,
];

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  declarations: [
    ...sharedComponent,
    ...layoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ...sharedComponent,
    ...layoutComponent,
  ]
})
export class SharedModule { }
