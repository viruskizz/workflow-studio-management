import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { User, UserDashboard } from 'src/app/models/user.model';
import { Team } from 'src/app/models/team.model';
import { Project } from 'src/app/models/project.model';
import { TaskStats } from 'src/app/models/task.model';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  userTeams: Team[] = [];
  workingOn: Project[] = [];
  taskStats: TaskStats = {
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0
  };
  loading = true;
  userDialog = false;
  
  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserDashboard(+userId);
    }
  }

  loadUserDashboard(userId: number): void {
    this.loading = true;
    
    // Get complete user dashboard data
    this.dashboardService.getUserDashboard(userId).pipe(
      catchError(error => {
        console.error('Error loading user dashboard:', error);
        return of({
          user: this.user,
          taskStats: { todo: 0, inProgress: 0, done: 0, total: 0 },
          workingOn: [],
          workingWith: []
        } as UserDashboard);
      })
    ).subscribe({
      next: (dashboard) => {
        this.user = dashboard.user;
        this.taskStats = dashboard.taskStats;
        this.workingOn = dashboard.workingOn;
        this.userTeams = dashboard.workingWith;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
    case 'TODO':
      return 'warning';
    case 'IN_PROGRESS':
      return 'info';
    case 'DONE':
      return 'success';
    default:
      return 'secondary';
    }
  }

  editUser() {
    if (this.user) {
      this.userDialog = true;
    }
  }
  
  hideDialog(event: User | null) {
    this.userDialog = false;
    if (event) {
      // Update the user data if changes were made
      this.user = event;
      // Reload dashboard data to reflect any changes
      if (this.user.id) {
        this.loadUserDashboard(this.user.id);
      }
    }
  }
}
