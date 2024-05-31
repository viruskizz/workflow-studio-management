import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-sidebar-dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent {
    constructor(private authService: AuthService) {}
    userProfile = AuthService.getProfile();
}