import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
})
export class DashboardSidebarComponent {
  showFiller = false;

  pages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
    { title: 'Project', url: '/projects', icon: 'work' },
    { title: 'Team', url: '/team', icon: 'group' },
    { title: 'Users', url: '/users', icon: 'person' },
    { title: 'Setting', url: '/settings', icon: 'settings' },
  ]
}
