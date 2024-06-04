import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    title = "Animation";
    pages: string[] = [
        'dashboard',
        'projects',
        'team',
        'members',
        'settings'
    ];

    constructor() {

    }

    ngOnInit(): void {
        
    }
}