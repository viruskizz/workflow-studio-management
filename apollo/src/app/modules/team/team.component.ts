import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, switchMap, forkJoin, of, catchError } from 'rxjs';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
})
export class TeamComponent implements OnInit {
  teams: Team[] = [];
  loading = false;
  teamDialog = false;

  constructor(
    private teamService: TeamService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.loading = true;
    this.teamService.listTeams()
      .pipe(finalize(() => this.loading = false))
      .subscribe(teams => this.teams = teams);
  }

  onEdit(team: Team) {
    this.router.navigate(['/teams', team.id]);
  }

  onDelete(team: Team) {
    this.loading = true;
    
    this.teamService.getTeamMembers(team.id!)
      .pipe(
        switchMap(members => {
          if (!members.length) return of([]);
          
          const removeRequests = members.map(member => 
            this.teamService.removeMemberFromTeam(team.id!, member.id!)
              .pipe(catchError(err => {
                console.warn(`Failed to remove member ${member.id}`, err);
                return of(null);
              }))
          );
          return forkJoin(removeRequests);
        }),
        switchMap(() => this.teamService.deleteTeam(team.id!)),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.teams = this.teams.filter(t => t.id !== team.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Team deleted successfully'
          });
        },
        error: this.handleError('delete team')
      });
  }

  onNew() {
    this.teamDialog = true;
  }

  onTeamSave(team: Team) {
    if (team) {
      this.loadTeams();
    }
  }

  onCloseDialog(team: Team | null) {
    if (team) {
      this.loadTeams();
    }
    this.teamDialog = false;
  }

  private handleError(operation: string) {
    return (err: Error) => {
      console.error(`Error ${operation}:`, err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to ${operation}. Please try again later.`
      });
    };
  }
}
