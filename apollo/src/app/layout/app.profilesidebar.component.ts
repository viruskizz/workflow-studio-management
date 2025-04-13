import { Component, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html'
})
export class AppProfileSidebarComponent implements OnInit {
    profile?: User;

    constructor(public layoutService: LayoutService, private authService: AuthService) { }

    ngOnInit(): void {
        this.profile = AuthService.getProfile();
    }
    signOut() {
        this.authService.signOut()
    }

    // Layout Setting
    get visible(): boolean {
        return this.layoutService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.profileSidebarVisible = _val;
    }
}