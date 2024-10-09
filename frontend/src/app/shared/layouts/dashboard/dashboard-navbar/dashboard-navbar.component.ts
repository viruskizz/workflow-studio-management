import { Component, Input } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
})
export class DashboardNavbarComponent {
  // showFiller = false;
  @Input({ required: true }) drawer: MatDrawer | undefined

  appName = 'Workflow'
}
