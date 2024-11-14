import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent implements OnInit {
    profile?: User;
    imgUrl = 'assets/layout/images/avatar.png'

    @ViewChild('menubutton') menuButton!: ElementRef;

    constructor(public layoutService: LayoutService) { }

    ngOnInit(): void {
        this.profile = AuthService.getProfile();
        console.log(this.profile)
        if (this.profile.imageUrl) {
            this.imgUrl = this.profile.imageUrl;
        }
    }
    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onProfileButtonClick() {
        this.layoutService.showProfileSidebar();
    }
    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

}