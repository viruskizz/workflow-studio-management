import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from 'src/app/models/user.model';
import { Project } from 'src/app/models/project.model';
import { Team } from 'src/app/models/team.model';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TaskStats } from 'src/app/models/task.model';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {
  user: User | null = null;
  workingOn: Project[] = [];
  taskStats: TaskStats = {
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0
  };
  userTeams: Team[] = [];
  
  constructor(
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    const profile = AuthService.getProfile();
    if (profile && profile.id) {
      this.loadUserDashboard(profile.id);
    }
  }

  loadUserDashboard(userId: number): void {
    this.dashboardService.getUserDashboard(userId).pipe(
      catchError(error => {
        console.error('Error loading dashboard data:', error);
        return of({
          user: null,
          taskStats: { todo: 0, inProgress: 0, done: 0, total: 0 },
          workingOn: [],
          workingWith: []
        });
      })
    ).subscribe({
      next: (dashboard) => {
        this.user = dashboard.user;
        this.taskStats = dashboard.taskStats;
        this.workingOn = dashboard.workingOn;
        this.userTeams = dashboard.workingWith;
      }
    });
  }
}
