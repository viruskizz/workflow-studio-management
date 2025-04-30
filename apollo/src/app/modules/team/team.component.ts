import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';

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
    private router: Router
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
    this.teamService.deleteTeam(team.id!)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.teams = this.teams.filter(t => t.id !== team.id),
        error: err => console.error('Error deleting team:', err)
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
}
