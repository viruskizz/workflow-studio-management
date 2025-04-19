import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { Team } from 'src/app/models/team.model';
import { Task } from 'src/app/models/task.model';
import { UserService } from 'src/app/services/user.service';
import { TeamService } from 'src/app/services/team.service';
import { TaskService } from 'src/app/services/task.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {
  user: User | null = null;
  userTeams: Team[] = [];
  taskStats = {
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0
  };
  loading = true;
  teamMembers: User[] = [];
  
  constructor(
    private userService: UserService,
    private teamService: TeamService,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const profile = AuthService.getProfile();
    if (profile && profile.id) {
      this.loadUserData(profile.id);
    } else {
      this.loading = false;
    }
  }

  loadUserData(userId: number): void {
    this.loading = true;
    
    this.userService.getUser(userId).pipe(
      switchMap(user => {
        this.user = user;
        
        return forkJoin({
          teams: this.getUserTeams(),
          tasks: this.getUserTasks(userId)
        });
      }),
      catchError(error => {
        console.error('Error loading user data:', error);
        this.user = null;
        return of({ teams: [], tasks: [] });
      })
    ).subscribe({
      next: ({ teams, tasks }) => {
        this.userTeams = teams;
        this.calculateTaskStats(tasks);
        this.loading = false;
        this.getTeamMembers();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getUserTeams() {
    return this.teamService.listTeams().pipe(
      switchMap(teams => {
        const teamRequests = teams.map(team => 
          this.teamService.getTeamMembers(team.id!).pipe(
            map(members => ({ ...team, members })),
            catchError(() => of({ ...team, members: [] }))
          )
        );
        
        return forkJoin(teamRequests).pipe(
          map(teamsWithMembers => {
            return teamsWithMembers.filter(team => 
              team.members.some(member => member.id === this.user?.id)
            );
          })
        );
      }),
      catchError(() => of([]))
    );
  }

  getUserTasks(userId: number) {
    return this.taskService.getUserTasks(userId).pipe(
      catchError(() => of([]))
    );
  }

  calculateTaskStats(tasks: Task[]): void {
    this.taskStats = {
      todo: 0,
      inProgress: 0,
      done: 0,
      total: tasks.length
    };
    
    tasks.forEach(task => {
      switch(task.status) {
      case 'TODO':
        this.taskStats.todo++;
        break;
      case 'IN_PROGRESS':
        this.taskStats.inProgress++;
        break;
      case 'DONE':
        this.taskStats.done++;
        break;
      default:
        this.taskStats.todo++;
        break;
      }
    });
  }

  getTeamMembers() {
    if (this.userTeams && this.userTeams.length > 0) {
      const membersMap = new Map<number, User>();
      
      const memberRequests = this.userTeams.map(team => 
        this.teamService.getTeamMembers(team.id!).pipe(
          catchError(() => of([]))
        )
      );
      
      forkJoin(memberRequests).subscribe(teamsMembers => {
        teamsMembers.forEach(members => {
          members.forEach((member: User) => {
            if (member.id && !membersMap.has(member.id)) {
              membersMap.set(member.id, member);
            }
          });
        });
        
        this.teamMembers = Array.from(membersMap.values());
      });
    }
  }
}
