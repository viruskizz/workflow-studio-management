import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

const sharedComponent: any[] = [
  HeaderComponent,
  SidebarComponent
];

@NgModule({
  declarations: [
    ...sharedComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ...sharedComponent
  ]
})
export class SharedModule { }
