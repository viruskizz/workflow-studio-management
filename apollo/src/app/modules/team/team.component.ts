import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TeamService } from 'src/app/services/team.service';
import { User } from 'src/app/models/user.model';

@Component({
    templateUrl: './team.component.html',
    providers: [MessageService, ConfirmationService],
})
export class TeamComponent implements OnInit {
    teams: Team[] = [];
    selectedTeam?: Team;
    teamDialog = false;
    deleteTeamDialog = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private teamService: TeamService,
    ) {}

    ngOnInit() {
        this.loadTeams();
    }

    loadTeams() {
        this.teamService.listTeams().subscribe({
            next: (teams) => {
                this.teams = teams;
                teams.forEach((team) => this.loadTeamDetails(team.id!));
            },
            error: (error) => console.error('Error loading teams:', error),
        });
    }

    loadTeamDetails(teamId: number) {
        this.teamService.getTeamWithMembers(teamId).subscribe({
            next: (teamWithDetails) => {
                const teamIndex = this.teams.findIndex((t) => t.id === teamId);
                if (teamIndex !== -1) {
                    this.teams[teamIndex] = teamWithDetails;
                    this.teams = [...this.teams];
                }
            },
            error: (error) =>
                console.error(
                    `Error loading details for team ${teamId}:`,
                    error
                ),
        });
    }

    editTeam(team: Team) {
        this.selectedTeam = { ...team };
        this.teamDialog = true;
    }

    openNewTeamDialog() {
        this.selectedTeam = undefined;
        this.teamDialog = true;
    }

    deleteTeam(team: Team) {
        this.confirmationService.confirm({
          message: `Are you sure you want to delete ${team.name}?`,
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.teamService.deleteTeam(team.id!).subscribe({
              next: () => {
                this.teams = this.teams.filter((t) => t.id !== team.id);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Team Deleted',
                  life: 3000,
                });
              },
              error: (error) => {
                console.error('Error deleting team:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to delete team',
                  life: 3000,
                });
              },
            });
          },
        });
      }
      

    onTeamSave(team: Team) {
        const index = this.teams.findIndex((t) => t.id === team.id);
        if (index > -1) {
            // Update existing team
            this.teams[index] = { ...this.teams[index], ...team };
        } else {
            // Add new team
            this.teams.push(team);
        }

        // Force change detection
        this.teams = [...this.teams];

        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: team.id ? 'Team Updated' : 'Team Created',
            life: 3000,
        });
        this.teamDialog = false;
        this.selectedTeam = undefined;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    getImage(url: string | undefined) {
        return url || 'assets/images/noimage.jpg';
    }

    onImageError(team: Team) {
        team.imageUrl = 'assets/images/noimage.jpg';
    }

 
}

