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
import { IconComponent } from './components/icon/icon.component';
import { PlusSvgComponent } from './svgs/plus-svg/plus-svg.component';
import { MagneifyingGlassSvgComponent } from './svgs/magneifying-glass-svg/magneifying-glass-svg.component';
import { ThreeDotSvgComponent } from './svgs/three-dot-svg/three-dot-svg.component';
import { FilterSvgComponent } from './svgs/filter-svg/filter-svg.component';
import { ArrowDownSvgComponent } from './svgs/arrow-down-svg/arrow-down-svg.component';
import { DashboardLayoutComponent } from './layouts/dashboard/dashboard-layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { DashboardNavbarComponent } from './layouts/dashboard/dashboard-navbar/dashboard-navbar.component';
import { DashboardSidebarComponent } from './layouts/dashboard/dashboard-sidebar/dashboard-sidebar.component';


const svgs: any[] = [
  PlusSvgComponent,
  MagneifyingGlassSvgComponent,
  ThreeDotSvgComponent,
  FilterSvgComponent,
  ArrowDownSvgComponent
]

const sharedComponent: any[] = [
  HeaderComponent,
  SidebarComponent,
  DynamicTableComponent,
  TableHeaderComponent,
  IconComponent
];

const layoutComponent: any[] = [
  MainLayoutComponent,
  UserLayoutComponent,
];

const layoutsComponents: any[] = [
  DashboardLayoutComponent,
  DashboardNavbarComponent,
  DashboardSidebarComponent,
]

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  declarations: [
    ...sharedComponent,
    ...layoutComponent,
    ...svgs,
    ...layoutsComponents,
    PlusSvgComponent,
    MagneifyingGlassSvgComponent,
    ThreeDotSvgComponent,
    FilterSvgComponent,
    ArrowDownSvgComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
  ],
  exports: [
    ...sharedComponent,
    ...layoutComponent,
    ...svgs,
    ...layoutsComponents,
    FontAwesomeModule,
  ]
})
export class SharedModule { }
