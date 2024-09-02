import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
  title = "Animation";
  pages = [
    { title: 'Dashboard', url: '/dashboard' },
    { title: 'Project', url: '/projects' },
    { title: 'Team', url: '/team' },
    { title: 'Users', url: '/users' },
    { title: 'Setting', url: '/settings' },
  ]

  constructor() {

  }

  ngOnInit(): void {

  }
}