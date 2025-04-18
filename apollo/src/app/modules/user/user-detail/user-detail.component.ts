import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { Team } from 'src/app/models/team.model';
import { Project } from 'src/app/models/project.model';
import { Task } from 'src/app/models/task.model';
import { UserService } from 'src/app/services/user.service';
import { TeamService } from 'src/app/services/team.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  userTeams: Team[] = [];
  userProjects: Project[] = [];
  taskStats = {
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0
  };
  loading = true;
  teamMembers: User[] = [];
  userDialog = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private teamService: TeamService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserData(+userId);
    }
  }

  loadUserData(userId: number): void {
    this.loading = true;
    
    // Get user details
    this.userService.getUser(userId).pipe(
      switchMap(user => {
        this.user = user;
        
        // After getting user, fetch related data in parallel
        return forkJoin({
          teams: this.getUserTeams(),
          projects: this.getUserProjects(userId),
          tasks: this.getUserTasks(userId)
        });
      }),
      catchError(error => {
        console.error('Error loading user data:', error);
        this.user = null;
        return of({ teams: [], projects: [], tasks: [] });
      })
    ).subscribe({
      next: ({ teams, projects, tasks }) => {
        this.userTeams = teams;
        this.userProjects = projects;
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

  getUserProjects(userId: number) {
    return this.projectService.listProject().pipe(
      switchMap(projects => {
        // Filter projects where user is a leader
        const userProjects = projects.filter(project => 
          project.leaderId === userId
        );
        return of(userProjects);
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
          // Count any other status in the todo counter
          this.taskStats.todo++;
          break;
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

  getTeamMembers() {
    if (this.userTeams && this.userTeams.length > 0) {
      // Collect all unique members from user's teams
      const membersMap = new Map<number, User>();
      
      // Process each team to get its members
      const memberRequests = this.userTeams.map(team => 
        this.teamService.getTeamMembers(team.id!).pipe(
          catchError(() => of([]))
        )
      );
      
      forkJoin(memberRequests).subscribe(teamsMembers => {
        // Flatten all team members and remove duplicates
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

  editUser() {
    if (this.user && this.user.id) {
      this.router.navigate(['/users', this.user.id, 'edit']);
    }
  }
  
  hideDialog(event: User | null) {
    this.userDialog = false;
    if (event) {
      // Update the user data if changes were made
      this.user = event;
    }
  }
}
